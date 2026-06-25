import numpy as np
import matplotlib.pyplot as plt

h = 0.4
x = np.arange(0, 10, h)
n = len(x)

y = np.zeros(n)

y[1] = y[0] + h*np.cos(x[0])

for i in range(1, n-1):

    a = np.cos(x[i])
    b = np.cos(x[i-1])

    y[i+1] = y[i] + h*(3*a - b)/2

y1 = np.sin(x)

plt.plot(x, y1, 'k--', label='sin(x)')
plt.plot(x, y, 'ro-', label='2-Step Adams-Bashforth (AB2)')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()