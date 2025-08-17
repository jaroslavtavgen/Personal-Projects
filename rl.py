import random

empty_square = 0
end_plus = 1
end_minus = 2
robot = 3
wall = 4
offboard = 5

board_width = 5
board_height = 5

directions = [ -1, 1, board_width, -board_width, board_width+1, board_width-1, -(board_width+1), -(board_width-1)]
directions = [ -1, 1, board_width, -board_width]

board = [offboard] * board_width * board_height
for row in range(1, board_height-1):
    for col in range(board_width-1):
        board[ row * board_height + col]= empty_square
board[board_width] = robot
board[(board_height-2) * board_width + board_width-2] = end_plus
board[(board_height-3) * board_width + board_width-2] = end_minus
print(board)
reward = 0
while True:
    robot_location = board.index(robot)
    robot_new_location = -1
    while True:
        robot_new_location = robot_location + random.choice(directions)
        if board[robot_new_location] == wall or board[robot_new_location] == offboard:
            continue
        break
    board[robot_location] = empty_square
    if board[robot_new_location] == end_minus:
        reward = -1
        board[robot_new_location] = robot
        print(board)
        break
    if board[robot_new_location] == end_plus:
        reward = 1
        board[robot_new_location] = robot
        print(board)
        break
    board[robot_new_location] = robot
    print(board)
print(f"Reward: {reward}")