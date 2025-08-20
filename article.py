def player_has_won(piece, board, board_side_length):
    for row in range(board_side_length):
        won = True
        for col in range(board_side_length):
            index = row * board_side_length + col
            if not board[row * board_side_length + col] == piece:
                won = False
                break
        if won:
            return  True
    for col in range(board_side_length):
        won = True
        for row  in range(board_side_length):
            if not board[row * board_side_length + col] == piece:
                won = False
                break
        if won:
            return  True
    col = 0
    row = 0
    won = True
    while row < board_side_length:
        if not board[row * board_side_length + col] == piece:
            won = False
            break
        col += 1
        row += 1
    if won:
        return True
    col = board_side_length - 1
    row = 0
    won = True
    while row < board_side_length:
        if not board[row * board_side_length + col] == piece:
            won = False
            break
        col -= 1
        row += 1
    if won:
        return True
    return False

def print_board(board, board_side_length):
    for i in range(0, board_side_length):
        print('-------------')
        out = '| '
        for j in range(0, board_side_length):
            index = i * board_side_length + j
            if board[index] == 1:
                token = 'x'
            if board[index] == -1:
                token = 'o'
            if board[index] == 0:
                token = ' '
            out += token + ' | '
        print(out)
    print('-------------')


def minimax(depth, alpha, beta, board, maximizing_player, whose_turn):
    global number_of_moves_counted
    number_of_moves_counted += 1
    if player_has_won(-whose_turn, board, board_side_length):
        if maximizing_player:
            return -(1000 - depth)
        else:
            return 1000 - depth
    empty_squares_indices = []
    for square_index in range(len(board)):
        if board[square_index] == 0:
            empty_squares_indices.append(square_index)
    if len(empty_squares_indices) == 0:
        if maximizing_player:
            return 0 + depth
        else:
            return 0 - depth
    if maximizing_player:
        best_score = -2000
        for square_index in empty_squares_indices:
            board[square_index] = whose_turn
            score = minimax(depth + 1, alpha, beta, board, not maximizing_player, -whose_turn)
            board[square_index] = 0
            if score > best_score:
                best_score = score
            if score > alpha:
                alpha = score
            if beta <= alpha:
                break
        return best_score
    else:
        best_score = 2000
        for square_index in empty_squares_indices:
            board[square_index] = whose_turn
            score = minimax(depth + 1,alpha, beta, board, not maximizing_player, -whose_turn)
            board[square_index] = 0
            if score < best_score:
                best_score = score
            if score < beta:
                beta = score
            if beta <= alpha:
                break
        return best_score




board_side_length = 3
board_length = board_side_length * board_side_length
number_of_moves_counted = 0

board = [0] * board_length
whose_turn = -1
while True:
    whose_turn = -whose_turn
    empty_squares_indices = []
    for square_index in range(len(board)):
        if board[square_index] == 0:
            empty_squares_indices.append(square_index)
    if len(empty_squares_indices) == 0:
        print("Draw!")
        break
    best_move = -1
    if whose_turn == -1:
        while True:
            row = int(input("Row: ")) - 1
            column = int(input("Column: ")) - 1
            best_move = row * board_side_length + column
            if board [ best_move ] == 0:
                break
    else:
        best_score = -2000
        for square_index in empty_squares_indices:
            board[square_index] = whose_turn
            score = minimax(0, -30000, 30000, board, False, -whose_turn)
            board[square_index] = 0
            if score > best_score:
                best_score = score
                best_move = square_index
        print(f"Number of moves counted: {number_of_moves_counted}")

    board[best_move] = whose_turn
    print_board(board, board_side_length)
    if player_has_won(whose_turn, board, board_side_length):
        print(f"{["Naughts", "None", "Crosses"][whose_turn + 1]} has won!")
        break