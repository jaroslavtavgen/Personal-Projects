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

board_side_length = 4
board_length = board_side_length * board_side_length

biggest_crosses = -1
lr = 0.2
minimum_naughts = 1000000000
states = [0] * board_length
total_number_of_games = 0
whole_program_timer = time.time()
while True:
    crosses = 0
    draws = 0
    naughts = 0
    for games in range(1000):
        board = [0] * board_length
        crosses_history = []
        outcome = 0
        whose_turn = -1
        while True:
            whose_turn = -whose_turn
            empty_squares_indices = []
            for square_index,_ in enumerate(board):
                if board[square_index] == 0:
                    empty_squares_indices.append(square_index)
            if len(empty_squares_indices) == 0:
                draws += 1
                break
            best_move = -1
            if whose_turn == -1:
                best_move = random.choice(empty_squares_indices)
            else:
                biggest_score = -1000000000
                for empty_squares_index in empty_squares_indices:
                    rate = states[empty_squares_index]
                    if rate > biggest_score:
                        biggest_score = rate
                        best_move = empty_squares_index
                crosses_history.append(best_move)
            board[best_move] = whose_turn
            if check_board(whose_turn, board_side_length, board):
                outcome = whose_turn
                break
        if outcome == -1:
            naughts += 1
            reward = -1
            crosses_history.reverse()
            for past_move in crosses_history:
                reward = states[past_move] + lr * (reward - states[past_move])
                states[past_move] = round(reward, 3)
        elif outcome == 1:
            crosses += 1
            reward = 1
            crosses_history.reverse()
            for past_move in crosses_history:
                reward = states[past_move] + lr * (reward - states[past_move])
                states[past_move] = round(reward, 3)

    print(f"crosses: {crosses} draws: {draws} naughts: {naughts} states: {states}")

