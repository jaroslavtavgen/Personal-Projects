import numpy as np
import pickle

BOARD_ROWS = 3
BOARD_COLS = 3


class State:
    def __init__(self, p1, p2):
        self.board = np.zeros((BOARD_ROWS, BOARD_COLS))
        self.p1 = p1
        self.p2 = p2
        self.isEnd = False
        self.boardHash = None
        # init p1 plays first
        self.playerSymbol = 1

    # get unique hash of current board state
    def getHash(self):
        self.boardHash = str(self.board.reshape(BOARD_COLS * BOARD_ROWS))
        return self.boardHash

    def winner(self):
        # row
        for i in range(BOARD_ROWS):
            if sum(self.board[i, :]) == 3:
                self.isEnd = True
                return 1
            if sum(self.board[i, :]) == -3:
                self.isEnd = True
                return -1
        # col
        for i in range(BOARD_COLS):
            if sum(self.board[:, i]) == 3:
                self.isEnd = True
                return 1
            if sum(self.board[:, i]) == -3:
                self.isEnd = True
                return -1
        # diagonal
        diag_sum1 = sum([self.board[i, i] for i in range(BOARD_COLS)])
        diag_sum2 = sum([self.board[i, BOARD_COLS - i - 1] for i in range(BOARD_COLS)])
        diag_sum = max(abs(diag_sum1), abs(diag_sum2))
        if diag_sum == 3:
            self.isEnd = True
            if diag_sum1 == 3 or diag_sum2 == 3:
                return 1
            else:
                return -1

        # tie
        # no available positions
        if len(self.get_all_available_positions()) == 0:
            self.isEnd = True
            return 0
        # not end
        self.isEnd = False
        return None

    def get_all_available_positions(self):
        positions = []
        for i in range(BOARD_ROWS):
            for j in range(BOARD_COLS):
                if self.board[i, j] == 0:
                    positions.append((i, j))  # need to be tuple
        return positions

    def updateState(self, position):
        self.board[position] = self.playerSymbol
        # switch to another player
        self.playerSymbol = -1 if self.playerSymbol == 1 else 1

    # only when game ends
    def giveReward(self):
        result = self.winner()
        # backpropagate reward
        if result == 1:
            self.p1.feedReward(1)
            self.p2.feedReward(0)
        elif result == -1:
            self.p1.feedReward(0)
            self.p2.feedReward(1)
        else:
            self.p1.feedReward(0.1)
            self.p2.feedReward(0.5)

    # board reset
    def reset(self):
        self.board = np.zeros((BOARD_ROWS, BOARD_COLS))
        self.boardHash = None
        self.isEnd = False
        self.playerSymbol = 1

    def play(self, number_of_rounds=100):
        for i in range(number_of_rounds):
            if i % 1000 == 0:
                print("Number of Rounds {}".format(i))
            while not self.isEnd:
                # Player 1
                all_available_positions = self.get_all_available_positions()
                player_1_future_square = self.p1.chooseAction(all_available_positions, self.board, self.playerSymbol)
                # take action and upate board state
                self.updateState(player_1_future_square)
                board_hash = self.getHash()
                self.p1.addState(board_hash)
                # check board status if it is end

                win = self.winner()
                if win is not None:
                    # self.showBoard()
                    # ended with p1 either win or draw
                    self.giveReward()
                    self.p1.reset()
                    self.p2.reset()
                    self.reset()
                    break

                else:
                    # Player 2
                    all_available_positions = self.get_all_available_positions()
                    player_2_future_square = self.p2.chooseAction(all_available_positions, self.board, self.playerSymbol)
                    self.updateState(player_2_future_square)
                    board_hash = self.getHash()
                    self.p2.addState(board_hash)

                    win = self.winner()
                    if win is not None:
                        # self.showBoard()
                        # ended with p2 either win or draw
                        self.giveReward()
                        self.p1.reset()
                        self.p2.reset()
                        self.reset()
                        break

    # play with human
    def play2(self):
        while not self.isEnd:
            # Player 1
            positions = self.get_all_available_positions()
            p1_action = self.p1.chooseAction(positions, self.board, self.playerSymbol)
            # take action and upate board state
            self.updateState(p1_action)
            self.showBoard()
            # check board status if it is end
            win = self.winner()
            if win is not None:
                if win == 1:
                    print(self.p1.name, "wins!")
                else:
                    print("tie!")
                self.reset()
                break

            else:
                # Player 2
                positions = self.get_all_available_positions()
                p2_action = self.p2.chooseAction(positions)

                self.updateState(p2_action)
                self.showBoard()
                win = self.winner()
                if win is not None:
                    if win == -1:
                        print(self.p2.name, "wins!")
                    else:
                        print("tie!")
                    self.reset()
                    break

    def showBoard(self):
        # p1: x  p2: o
        for i in range(0, BOARD_ROWS):
            print('-------------')
            out = '| '
            for j in range(0, BOARD_COLS):
                if self.board[i, j] == 1:
                    token = 'x'
                if self.board[i, j] == -1:
                    token = 'o'
                if self.board[i, j] == 0:
                    token = ' '
                out += token + ' | '
            print(out)
        print('-------------')


class Player:
    def __init__(self, name, exp_rate=0.3):
        self.name = name
        self.states = []  # record all positions taken
        self.lr = 0.2
        self.exp_rate = exp_rate
        self.decay_gamma = 0.9
        self.states_value = {}  # state -> value

    def getHash(self, board):
        boardHash = str(board.reshape(BOARD_COLS * BOARD_ROWS))
        return boardHash

    def chooseAction(self, positions, current_board, symbol):
        if np.random.uniform(0, 1) <= self.exp_rate:
            # take random action
            idx = np.random.choice(len(positions))
            action = positions[idx]
        else:
            value_max = -999
            for p in positions:
                next_board = current_board.copy()
                next_board[p] = symbol
                next_boardHash = self.getHash(next_board)
                value = 0 if self.states_value.get(next_boardHash) is None else self.states_value.get(next_boardHash)
                # print("value", value)
                if value >= value_max:
                    value_max = value
                    action = p
        # print("{} takes action {}".format(self.name, action))
        return action

    # append a hash state
    def addState(self, state):
        self.states.append(state)

    # at the end of game, backpropagate and update states value
    def feedReward(self, reward):
        for st in reversed(self.states):
            if self.states_value.get(st) is None:
                self.states_value[st] = 0
            self.states_value[st] += self.lr * (self.decay_gamma * reward - self.states_value[st])
            reward = self.states_value[st]

    def reset(self):
        self.states = []

    def savePolicy(self):
        fw = open('policy_' + str(self.name), 'wb')
        pickle.dump(self.states_value, fw)
        fw.close()

    def loadPolicy(self, file):
        fr = open(file, 'rb')
        self.states_value = pickle.load(fr)
        fr.close()


class HumanPlayer:
    def __init__(self, name):
        self.name = name

    def chooseAction(self, positions):
        while True:
            row = int(input("Input your action row:"))
            col = int(input("Input your action col:"))
            action = (row, col)
            if action in positions:
                return action

    # append a hash state
    def addState(self, state):
        pass

    # at the end of game, backpropagate and update states value
    def feedReward(self, reward):
        pass

    def reset(self):
        pass


if __name__ == "__main__":
    # training

    board = np.zeros((BOARD_ROWS, BOARD_COLS))
    board_hash = None
    decay_gamma = 0.9
    exp_rate = 0.3
    learning_rate = 0.2
    names = [ "p1", "p2" ]
    piece = 1
    states_array = []
    states_values = [ {}, {} ]
    the_game_has_ended = False
    for i in range(50000):
        if i % 1000 == 0:
            print("Number of Rounds {}".format(i))

    while not the_game_has_ended:
        all_available_positions = []
        for i in range(BOARD_ROWS):
            for j in range(BOARD_COLS):
                if board[i, j] == 0:
                    all_available_positions.append((i, j))
        # all_available_positions = [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]
        player_1_future_square = -1
        if np.random.uniform(0, 1) <= exp_rate:
            index = np.random.choice(len(all_available_positions))
            player_1_future_square = all_available_positions[index]
        else:
            best_score = -999
            for position in all_available_positions:
                next_board = board.copy()
                next_board[position] = piece
                next_board_hash = str(next_board.reshape(BOARD_COLS * BOARD_ROWS)) # [1. 0. 0. 0. 0. 0. 0. 0. 0.]
                value = 0 if states_values[0].get(next_board_hash) is None else states_values[0].get(next_board_hash)
                if value >= best_score:
                    best_score = value
                    player_1_future_square = position

        board[player_1_future_square] = piece
        piece = -1 if piece == 1 else 1
        token = ' '
        for i in range(0, BOARD_ROWS):
            print('-------------')
            out = '| '
            for j in range(0, BOARD_COLS):
                if board[i, j] == 1:
                    token = 'x'
                if board[i, j] == -1:
                    token = 'o'
                if board[i, j] == 0:
                    token = ' '
                out += token + ' | '
            print(out)
        print('-------------')
        outcome = None
        for i in range(BOARD_ROWS):
            if sum(board[i, :]) == 3:
                the_game_has_ended = True
                outcome = 1
            if sum(board[i, :]) == -3:
                the_game_has_ended = True
                outcome = -1
        for i in range(BOARD_COLS):
            if sum(board[:, i]) == 3:
                the_game_has_ended = True
                outcome = 1
            if sum(board[:, i]) == -3:
                the_game_has_ended = True
                outcome = -1
        # diagonal
        diag_sum1 = sum([board[i, i] for i in range(BOARD_COLS)])
        diag_sum2 = sum([board[i, BOARD_COLS - i - 1] for i in range(BOARD_COLS)])
        diag_sum = max(abs(diag_sum1), abs(diag_sum2))
        if diag_sum == 3:
            the_game_has_ended = True
            if diag_sum1 == 3 or diag_sum2 == 3:
                outcome = 1
            else:
                outcome = -1
        all_available_positions2 = []
        for i in range(BOARD_ROWS):
            for j in range(BOARD_COLS):
                if board[i, j] == 0:
                    all_available_positions2.append((i, j))

        if len(all_available_positions2) == 0:
            the_game_has_ended = True
            outcome = 0

        the_game_has_ended = False
        outcome = None
        if outcome is not None:
            if outcome == 1:
                print("Crosses wins!")
            else:
                print("tie!")
            board = np.zeros((BOARD_ROWS, BOARD_COLS))
            board_hash = None
            the_game_has_ended = False
            piece = 1
            break

    p1 = Player("p1")
    p2 = Player("p2")

    st = State(p1, p2)
    print("training...")
    st.play(50000)
    p1.savePolicy()

    # play with human
    p1 = Player("computer", exp_rate=0)
    p1.loadPolicy("policy_p1")

    p2 = HumanPlayer("human")

    st = State(p1, p2)
    st.play2()
"""