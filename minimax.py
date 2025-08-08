import math
import random
import numpy as np
import time

from fontTools.misc.cython import returns


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

number_of_nodes = 0

def minimax(depth, board, board_side_length, whose_turn):
    global number_of_nodes
    number_of_nodes += 1
    if depth == 0 or check_board(-whose_turn, board_side_length, board):
        return
    empty_squares_indices = []
    for square_index in range(board_length):
        if board[square_index] == 0:
            empty_squares_indices.append(square_index)
    if len(empty_squares_indices) == 0:
        return
    for empty_square_index in empty_squares_indices:
        board[empty_square_index] = whose_turn
        minimax(depth - 1, board, board_side_length, -whose_turn)
        board[empty_square_index] = 0

board_side_length = 4
board_length = board_side_length * board_side_length
minimum_naughts = 1000000000
biggest_crosses = -1

number_of_games_in_each_bulk = 1
total_number_of_games = 0
whole_program_timer = time.time()
while True:
    crosses = 0
    draws = 0
    naughts = 0
    thousand_games_timer = time.time()
    for games in range(number_of_games_in_each_bulk):
        board = [0] * board_length
        outcome = 0
        whose_turn = -1  # -1: naughts 1: crosses
        while True:
            whose_turn = -whose_turn
            empty_squares_indices = []
            for square_index in range(board_length):
                if board[square_index] == 0:
                    empty_squares_indices.append(square_index)
            if len(empty_squares_indices) == 0:
                break
            minimax_timer = time.time()
            number_of_nodes = 0
            minimax(8, board, board_side_length, whose_turn)
            print(f"{time.time()-minimax_timer} seconds elapsed number of nodes: {number_of_nodes}")
            best_move = random.choice(empty_squares_indices)
            board[best_move] = whose_turn
            if check_board(whose_turn, board_side_length, board): # did the player win?
                break