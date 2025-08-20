import numpy as np

rows = 3
cols = 4
win_state = (0,3)
lose_state = (1,3)
start = (2,0)
deterministic = True


class State:
    def __init__(self, state=start):
        self.board = np.zeros([rows,cols])
        self.board[1,1] = -1
        self.state = state
        self.is_end = False
        self.determine = deterministic

    def give_reward(self):
        if self.state == win_state:
            return 1
        elif self.state == lose_state:
            return -1
        else:
            return 0

    def has_the_game_ended(self):
        if self.state == win_state or self.state == lose_state:
            self.is_end = True

    def next_position(self, action):
        if self.determine:
            next_state = (-1,-1)
            if action == "up":
                next_state = (self.state[0]-1, self.state[1])
            elif action == "down":
                next_state = (self.state[0]+1, self.state[1])
            elif action == "left":
                next_state = (self.state[0], self.state[1]-1)
            elif action == "right":
                next_state = (self.state[0], self.state[1]+1)
            self.determine = False

        if 0 <= next_state[0] <= (rows - 1):
            if 0 <= next_state[1] <= (cols - 1):
                if not next_state[1] == (1, 1):
                    return next_state
        return self.state

class Agent:
    def __init__(self):
        self.states = []
        self.actions = ["up", "down", "left", "right"]
        self.state = State()
        self.lr = 0.2
        self.exp_rate = 0.3

        self.state_values = {}
        for i in range(rows):
            for j in range(cols):
                self.state_values[(i,j)] = 0

    def choose_action(self):
        if np.random.uniform(0, 1) < self.exp_rate:
            action = np.random.choice(self.actions)
        else:
            biggest_reward = -1000000000
            action = ""
            for a in self.actions:
                reward = self.state_values[self.state.next_position(a)]
                if reward > biggest_reward:
                    biggest_reward = reward
                    action = a
        return action

    def choose_action_probabilistic(self, action):
        if action == "up":
            return np.random.choice(["up", "left", "right"], p=[0.8, 0.1, 0.1])
        if action == "down":
            return np.random.choice(["down", "left", "right"], p=[0.8, 0.1, 0.1])
        if action == "left":
            return np.random.choice(["left", "up", "down"], p=[0.8, 0.1, 0.1])
        if action == "right":
            return np.random.choice(["right", "up", "down"], p=[0.8, 0.1, 0.1])

    def play(self, rounds=10):
        i = 0
        while i < rounds:
            if self.state.is_end:
                reward = self.state.give_reward()
                self.state_values[self.state.state] = reward
                print("Game End Reward:", reward)
                for s in reversed(self.states):
                    reward = self.state_values[s] + self.lr * (reward - self.state_values[s])
                    self.state_values[s] = round(reward, 3)
                self.reset()
                i += 1
            else:
                action = self.choose_action()
                self.states.append(self.state.next_position(action))
                print("Current position: {}. Action: {}".format(self.state.state, action))
                self.state = self.take_action(action)
                self.state.has_the_game_ended()
                print("Next State: {}".format(self.state.state))
                print("---------------------")

    def reset(self):
        self.states = []
        self.state = State()

    def showValues(self):
        for i in range(0, rows):
            print('----------------------------------')
            out = '| '
            for j in range(0, cols):
                out += str(self.state_values[(i, j)]).ljust(6) + ' | '
            print(out)
        print('----------------------------------')

    def take_action(self, action):
        return State(state=self.state.next_position(action))

ag = Agent()
ag.play(50)
print(ag.showValues())