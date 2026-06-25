import numpy as np
import matplotlib.pyplot as plt

h = 0.5
x = np.arange(0, 10, h)
n = len(x)

y1 = np.zeros(n)

for i in range(n-1):
    k1 = np.cos(x[i])

    yp = y1[i] + h*k1

    k2 = np.cos(x[i+1])

    y1[i+1] = y1[i] + h*(k1 + k2)/2

y = np.sin(x)

plt.plot(x, y, 'k--', label='sin(x)')
plt.plot(x, y1, 'go-', label='Modified Euler')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()