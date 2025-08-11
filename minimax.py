import math
import random
from operator import truediv

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

beta_cut_offs = 0
number_of_nodes = 0
biggest = 0


def negamax(depth, alpha, beta, board, board_side_length, whose_turn, threshold, i, j):
    global number_of_nodes, beta_cut_offs, to_break, biggest
    number_of_nodes += 1
    if number_of_nodes == 1000000:
        to_break = True
        return beta_cut_offs
    if check_board(-whose_turn, board_side_length, board):
        score = 29000 - (len(board) - depth)
        return score * -whose_turn
    if depth == 0:
        score = len(board) - depth
        return score * -whose_turn
    empty_squares_indices = []
    for square_index in range(board_length):
        if board[square_index] == 0:
            empty_squares_indices.append(square_index)
    if len(empty_squares_indices) == 0:
        score = len(board) - depth
        return score * -whose_turn
    if depth == threshold:
        temp = empty_squares_indices[i]
        empty_squares_indices[i] = empty_squares_indices[j]
        empty_squares_indices[j] = temp
    if whose_turn == 1:
        best_score = -1000000000
        for square_index in empty_squares_indices:
            board[square_index] = whose_turn
            eval = negamax(depth-1, alpha, beta, board, board_side_length, -whose_turn, threshold, i, j)
            board[square_index] = 0
            if to_break:
                return eval
            best_score = max(best_score, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                beta_cut_offs += 1
                break
        return best_score
    else:
        best_score = 1000000000
        for square_index in empty_squares_indices:
            board[square_index] = whose_turn
            eval = negamax(depth-1, alpha, beta, board, board_side_length, -whose_turn, threshold, i, j)
            if to_break:
                return eval
            board[square_index] = 0
            best_score = min(best_score, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                beta_cut_offs += 1
                break
        return best_score


board_side_length = 4
board_length = board_side_length * board_side_length
minimum_naughts = 1000000000
biggest_crosses = -1

number_of_games_in_each_bulk = 1
total_number_of_games = 0
whole_program_timer = time.time()

minimax_timer = time.time()
minimum_nodes = 100000000
best_index = -1
times = 0
to_break_from_cycle = False
to_break = False
for depth in range(16, -1, -1):
    for i in range(depth):
        for j in range(depth):
            if not (depth==16 and i==0 and j==0) and i == j:
                continue
            board = [0] * board_length
            number_of_nodes = 0
            beta_cut_offs = 0
            to_break = False
            print(f"depth: {depth}, i: {i}, j: {j}")
            number_of_cutoffs = negamax(board_length, -30000, 30000, board, board_side_length, 1, depth, i, j)
            if number_of_cutoffs > biggest:
                biggest = number_of_cutoffs
                print(f"biggest = {biggest}")
                print(f"if depth == {depth}:\n    temp = empty_squares_indices[{i}]\n    empty_squares_indices[{i}] = empty_squares_indices[{j}]\n    empty_squares_indices[{j}] = temp\n")
                to_break_from_cycle = True
    if to_break_from_cycle:
        break