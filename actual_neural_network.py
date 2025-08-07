import random

import numpy as np


def _sigmoid(x):
    return 1 / (1 + np.exp(-x))


def _delsigmoid(x):
    return x * (1 - x)

num_input = 16
num_hidden = 64
num_output = 1

beta1   = 0.9
beta2   = 0.999
epsilon = 1e-8
lr      = 0.002

weights_01 = np.random.uniform(size=(num_input, num_hidden))
weights_12 = np.random.uniform(size=(num_hidden, num_output))
b01 = np.random.uniform(size=(1, num_hidden))
b12 = np.random.uniform(size=(1, num_output))

m01 = np.zeros_like(weights_01); v01 = np.zeros_like(weights_01)
m12 = np.zeros_like(weights_12); v12 = np.zeros_like(weights_12)
mb01 = np.zeros_like(b01);       vb01 = np.zeros_like(b01)
mb12 = np.zeros_like(b12);       vb12 = np.zeros_like(b12)

t = 0

quotes =  [5363.36, 5268.05, 5456.9, 4982.77, 5062.25, 5074.08, 5396.52, 5670.97, 5633.07, 5611.85, 5580.94, 5693.31, 5712.2, 5776.65, 5767.57, 5667.56, 5662.89, 5675.29, 5614.66, 5675.12, 5638.94, 5521.52, 5599.3, 5572.07, 5614.56, 5770.2, 5738.52, 5842.63, 5778.15, 5849.72, 5954.5, 5861.57, 5956.06, 5955.25, 5983.25, 6013.13, 6117.52, 6144.15, 6129.58, 6114.63, 6115.07, 6051.97, 6068.5, 6066.44, 6025.99, 6083.57, 6061.48, 6037.88, 5994.57, 6040.53, 6071.17, 6039.31, 6067.7, 6012.28, 6101.24, 6118.71, 6086.37, 6049.24, 5996.66, 5937.34, 5949.91, 5842.91, 5836.22, 5827.04, 5918.25, 5909.03, 5975.38, 5942.47, 5868.55, 5881.63, 5906.94, 5970.84, 6037.59, 6040.04, 5974.07, 5930.85, 5867.08, 5872.16, 6050.61, 6074.08, 6051.09, 6051.25, 6084.19, 6034.91, 6052.85, 6090.27, 6075.11, 6086.49, 6049.88, 6047.15, 6032.38, 5998.74, 6021.63, 5987.37, 5969.34, 5948.71, 5917.11, 5916.98, 5893.62, 5870.62, 5949.17, 5985.38, 5983.99, 6001.35, 5995.54, 5973.1, 5929.04, 5782.76, 5712.69, 5728.8, 5705.45, 5813.67, 5832.92, 5823.52, 5808.12, 5809.86, 5797.42, 5851.2, 5853.98, 5864.67, 5841.47, 5842.47, 5815.26, 5859.85, 5815.03, 5780.05, 5792.04, 5751.13, 5695.94, 5751.07, 5699.94, 5709.54, 5708.75, 5762.48, 5738.17, 5745.37, 5722.26, 5732.93, 5718.57, 5702.55, 5713.64, 5618.26, 5634.58, 5633.09, 5626.02, 5595.76, 5554.13, 5495.52, 5471.05, 5408.42, 5503.41, 5520.07, 5528.93, 5648.4, 5591.96, 5592.18, 5625.8, 5616.84, 5634.61, 5570.64, 5620.85, 5597.12, 5608.25, 5554.25, 5543.22, 5455.21, 5434.43, 5344.39, 5344.16, 5319.31, 5199.5, 5240.03, 5186.33, 5346.56, 5446.68, 5522.3, 5436.44, 5463.54, 5459.1, 5399.22, 5427.13, 5555.74, 5564.41, 5505, 5544.59, 5588.27, 5667.2, 5631.22, 5615.35, 5584.54, 5633.91, 5576.98, 5572.85, 5567.19, 5537.02, 5509.01, 5475.09, 5460.48, 5482.87, 5477.9, 5469.3, 5447.87, 5464.62, 5473.17, 5487.03, 5473.23, 5431.6, 5433.74, 5421.03, 5375.32, 5360.79, 5346.99, 5352.96, 5354.03, 5291.34, 5283.4, 5277.51, 5235.48, 5266.95, 5306.04, 5304.72, 5267.84, 5307.01, 5321.41, 5308.13, 5303.27, 5297.1, 5308.15, 5246.68, 5221.42, 5222.68, 5214.08, 5187.67, 5187.7, 5180.74, 5127.79, 5064.2, 5018.39, 5035.69, 5116.17, 5099.96, 5048.42, 5071.63, 5070.55, 5010.6, 4967.23, 5011.12, 5022.21, 5051.41, 5061.82]

print(len(quotes))

train_data = np.loadtxt("inputs.txt", ndmin=2)
target_xor = np.loadtxt("outputs.txt", ndmin=2)


while True:
    break
    for _ in range(20000):
        losses = []
        hidden_ = np.dot(train_data, weights_01) + b01
        hidden_out = _sigmoid(hidden_)
        output_ = np.dot(hidden_out, weights_12) + b12
        output_final = _sigmoid(output_)
        loss = 0.5 * (target_xor - output_final) ** 2
        losses.append(np.sum(loss))

        error_term = (target_xor - output_final)

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
    if correct_loss < 0.1:
        break
    weights_01 = np.random.uniform(size=(num_input, num_hidden))
    weights_12 = np.random.uniform(size=(num_hidden, num_output))
    b01 = np.random.uniform(size=(1, num_hidden))
    b12 = np.random.uniform(size=(1, num_output))

    m01 = np.zeros_like(weights_01);
    v01 = np.zeros_like(weights_01)
    m12 = np.zeros_like(weights_12);
    v12 = np.zeros_like(weights_12)
    mb01 = np.zeros_like(b01);
    vb01 = np.zeros_like(b01)
    mb12 = np.zeros_like(b12);
    vb12 = np.zeros_like(b12)

    t = 0


