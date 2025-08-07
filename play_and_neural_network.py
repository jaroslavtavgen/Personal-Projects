import math
import random
import numpy as np
import time

def check_board(whose_turn, three, board):
    for row in range(three):
        won = True
        for col in range(three):
            index = row * three + col
            if not board[row * three + col] == whose_turn:
                won = False
                break
        if won:
            return  True
    for col in range(three):
        won = True
        for row  in range(three):
            if not board[row * three + col] == whose_turn:
                won = False
                break
        if won:
            return  True
    col = 0
    row = 0
    won = True
    while row < three:
        if not board[row * three + col] == whose_turn:
            won = False
            break
        col += 1
        row += 1
    if won:
        return True
    col = three - 1
    row = 0
    won = True
    while row < three:
        if not board[row * three + col] == whose_turn:
            won = False
            break
        col -= 1
        row += 1
    if won:
        return True
    return False

def _sigmoid(x):
    return 1 / (1 + np.exp(-x))


def _delsigmoid(x):
    return x * (1 - x)

def tanh(x):
    """
    Hyperbolic tangent.
    Accepts a float/int, list, tuple, or NumPy array.
    Returns a float or NumPy array with tanh applied element-wise.
    """
    # Use NumPy’s vectorized versions if x is array-like
    if isinstance(x, (list, tuple, np.ndarray)):
        x = np.asarray(x, dtype=float)
        return np.tanh(x)
    else:
        # Scalar math
        return (math.exp(x) - math.exp(-x)) / (math.exp(x) + math.exp(-x))

def dtanh(x):
    """
    Derivative of tanh: 1 − tanh²(x).
    Accepts the same inputs as tanh().
    """
    t = tanh(x)
    return 1 - t * t

board_side_length = 4
board_length = board_side_length * board_side_length

num_input = board_length * 3
num_hidden = 128
num_output = 1
lr      = 0.002

weights_01 = np.loadtxt("weights_01.txt", ndmin=2)
weights_12 = np.loadtxt("weights_12.txt", ndmin=2)
b01 = np.loadtxt("b01.txt", ndmin=2)
b12 = np.loadtxt("b12.txt", ndmin=2)

if not len(weights_01) == num_input or not len(weights_01[0]) == num_hidden:
    weights_01 = np.random.uniform(size=(num_input, num_hidden))
    weights_12 = np.random.uniform(size=(num_hidden, num_output))
    b01 = np.random.uniform(size=(1, num_hidden))
    b12 = np.random.uniform(size=(1, num_output))

    weights_01 -= 0.5
    weights_12 -= 0.5
    b01 -= 0.5
    b12 -= 0.5
"""
# This stuff is required for Adam
m01 = np.zeros_like(weights_01); v01 = np.zeros_like(weights_01)
m12 = np.zeros_like(weights_12); v12 = np.zeros_like(weights_12)
mb01 = np.zeros_like(b01);       vb01 = np.zeros_like(b01)
mb12 = np.zeros_like(b12);       vb12 = np.zeros_like(b12)
t = 0
"""

inputs = []
outputs = []

biggest_crosses = -1
initial_limit = 100
limit = initial_limit
minimum_naughts = 1000000000
total_number_of_games = 0
start = time.time()
while True:
    crosses = 0
    draws = 0
    naughts = 0
    for games in range(1000):
        board = [0] * board_length*3
        for i in range(board_length):
            board[board_length*2+i]=1
        game_history = [] # store all moves in the game so we could feed inputs with it
        outcome = 0
        whose_turn = 0.1  # -1: naughts 1: crosses
        while True:
            if whose_turn == 0.1:
                whose_turn = 0.9
            else:
                whose_turn = 0.1
            empty_squares_indices = []
            for square_index in range(board_length):
                if board[board_length*2+square_index] == 1:
                    empty_squares_indices.append(square_index)
            if len(empty_squares_indices) == 0:
                # It's a draw then
                draws += 1
                break
            best_move = -1
            offset = 0
            if whose_turn == 0.1: # Naughts play randomly
                best_move = random.choice(empty_squares_indices)
                offset = 1
            else:  # crosses play according to neural network
                best_score = -1
                for index in empty_squares_indices:
                    board[index] = 1
                    board[board_length*2+index] = 0
                    hidden_ = np.dot(np.array([board[:]]), weights_01) + b01
                    hidden_out = _sigmoid(hidden_)
                    output_ = np.dot(hidden_out, weights_12) + b12
                    output_final = _sigmoid(output_)[0][0] # score of the position
                    board[index] = 0
                    board[board_length*2+index] = 1
                    if best_score < output_final:
                        best_score = output_final
                        best_move = index
            board[offset*board_length + best_move] = 1
            board[board_length * 2 + best_move] = 0
            game_history.append(board[:])
            board_for_checking = []
            for i in range(board_length):
                board_for_checking.append(board[offset*board_length+i])
            if check_board(1, board_side_length, board_for_checking): # did the player win?
                if whose_turn == 0.1:
                    naughts += 1
                else:
                    crosses += 1
                outcome = whose_turn
                break
        if outcome == 0.1:
            # If naughts have won we record the last position after our move as losing
            if not game_history[-2] in inputs:
                inputs.append(game_history[-2][:])
                outputs.append([0])
        # If naughts have not won we record the last position after our move as winning
        else:
            if not game_history[-1] in inputs:
                inputs.append(game_history[-1][:])
                outputs.append([1])
        total_number_of_games += 1
        if len(inputs) >= limit:
            print(f"inputs = {inputs}")
            print(f"outputs = {outputs}")
            limit += initial_limit
            train_data = np.array(inputs, ndmin=2)
            target_xor = np.array(outputs, ndmin=2)
            while True:
                for _ in range(20000):
                    losses = []
                    hidden_ = np.dot(train_data, weights_01) + b01
                    hidden_out = _sigmoid(hidden_)
                    output_ = np.dot(hidden_out, weights_12) + b12
                    output_final = _sigmoid(output_)
                    loss = 0.5 * (target_xor - output_final) ** 2
                    losses.append(np.sum(loss))

                    error_term = (target_xor - output_final)
                    grad01 = train_data.T @ (
                            ((error_term * _delsigmoid(output_final)) * weights_12.T) * _delsigmoid(
                        hidden_out))

                    grad12 = hidden_out.T @ (error_term * _delsigmoid(output_final))

                    weights_01 += lr * grad01
                    weights_12 += lr * grad12

                    b01 += np.sum(
                        lr * ((error_term * _delsigmoid(output_final)) * weights_12.T) * _delsigmoid(
                            hidden_out), axis=0)
                    b12 += np.sum(lr * error_term * _delsigmoid(output_final), axis=0)

                    """
                    delta2 = error_term * _delsigmoid(output_final)  # shape (batch , 1)
                    grad12 = hidden_out.T @ delta2  # weights_12 gradient
                    db12 = np.sum(delta2, axis=0, keepdims=True)  # bias   b12  gradient

                    # --- hidden layer -------------------------------------------------
                    delta1 = (delta2 @ weights_12.T) * _delsigmoid(hidden_out)  # shape (batch , hidden)
                    grad01 = train_data.T @ delta1  # weights_01 gradient
                    db01 = np.sum(delta1, axis=0, keepdims=True)  # bias   b01  gradient
                    t += 1  # increment time step

                    # ---------- layer 0→1 weights ---------------------------------
                    m01 = beta1 * m01 + (1 - beta1) * grad01
                    v01 = beta2 * v01 + (1 - beta2) * (grad01 ** 2)
                    m01_hat = m01 / (1 - beta1 ** t)  # bias-corrected
                    v01_hat = v01 / (1 - beta2 ** t)
                    weights_01 += lr * m01_hat / (np.sqrt(v01_hat) + epsilon)

                    # ---------- layer 1→2 weights ---------------------------------
                    m12 = beta1 * m12 + (1 - beta1) * grad12
                    v12 = beta2 * v12 + (1 - beta2) * (grad12 ** 2)
                    m12_hat = m12 / (1 - beta1 ** t)
                    v12_hat = v12 / (1 - beta2 ** t)
                    weights_12 += lr * m12_hat / (np.sqrt(v12_hat) + epsilon)

                    # ---------- bias vectors --------------------------------------
                    mb01 = beta1 * mb01 + (1 - beta1) * db01  # db01 is the bias gradient you already compute
                    vb01 = beta2 * vb01 + (1 - beta2) * (db01 ** 2)
                    b01 += lr * (mb01 / (1 - beta1 ** t)) / (np.sqrt(vb01 / (1 - beta2 ** t)) + epsilon)

                    mb12 = beta1 * mb12 + (1 - beta1) * db12
                    vb12 = beta2 * vb12 + (1 - beta2) * (db12 ** 2)
                    b12 += lr * (mb12 / (1 - beta1 ** t)) / (np.sqrt(vb12 / (1 - beta2 ** t)) + epsilon)
                """
                hidden_ = np.dot(train_data, weights_01) + b01
                hidden_out = _sigmoid(hidden_)
                output_ = np.dot(hidden_out, weights_12) + b12
                output_final = _sigmoid(output_)
                loss = abs(target_xor - output_final)
                biggest_loss = np.max(loss)
                print(f"biggest_loss: {biggest_loss} num_hidden: {num_hidden}")
                loss = 0.5 * (target_xor - output_final) ** 2
                correct_loss = np.sum(loss)
                print(correct_loss)
                if correct_loss < 0.01:
                    break
                """
                weights_01 = np.random.uniform(size=(num_input, num_hidden))
                weights_12 = np.random.uniform(size=(num_hidden, num_output))
                b01 = np.random.uniform(size=(1, num_hidden))
                b12 = np.random.uniform(size=(1, num_output))
                """

                """
                # This stuff is required for Adam
                m01 = np.zeros_like(weights_01);
                v01 = np.zeros_like(weights_01)
                m12 = np.zeros_like(weights_12);
                v12 = np.zeros_like(weights_12)
                mb01 = np.zeros_like(b01);
                vb01 = np.zeros_like(b01)
                mb12 = np.zeros_like(b12);
                vb12 = np.zeros_like(b12)
                t = 0
                """
            print("Updated!")
    if minimum_naughts > naughts or (minimum_naughts == naughts and biggest_crosses < crosses):
        minimum_naughts = naughts
        biggest_crosses = crosses
        np.savetxt("weights_01.txt", weights_01)
        np.savetxt("weights_12.txt", weights_12)
        np.savetxt("b01.txt", b01)
        np.savetxt("b12.txt", b12)
        print("Weights saved!")
    print(
        f"crosses: {crosses} draws: {draws} naughts: {naughts} minimum_defeats_in_1000_games: {minimum_naughts} total_number_of_games: {total_number_of_games} {time.time() - start} seconds elapsed")
    # After 1000 games are played we train our network on recorded positions