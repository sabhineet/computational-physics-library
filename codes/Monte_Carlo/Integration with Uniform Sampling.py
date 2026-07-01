import random
import math
import numpy as np

random.seed(10)

def f(x):
    return np.exp(-np.sum(x**2))


def MCIntegral(n, a, b, dim):
    sum = 0
    sum2 = 0
    x = np.zeros(dim)
    c = b - a
    for _ in range(n):
        for j in range(dim):
            x[j] = random.uniform(a[j], b[j])
        val = f(x)
        sum += val
        sum2 += val**2

    vol = np.prod(c)
    integral = vol * sum / n
    err = math.sqrt((sum2 / n) - (sum / n)**2) * vol / math.sqrt(n)
    return integral


dim = 3
a = np.array([0]*dim)
b = np.array([4/math.sqrt(2)] * dim)
n_e = 10
n_s = 10000

avg = 0

for _ in range(n_e):
    avg += (2/math.sqrt(math.pi))**dim * MCIntegral(n_s, a, b, dim)


print(f"Estimated integral over {n_e} evaluations taking {n_s} samples each: {avg/n_e}")