import numpy as np
import matplotlib.pyplot as plt

h = 0.5
x = np.arange(0, 10, h)
n = len(x)

y1 = np.zeros(n)

for i in range(n-1):

    k1 = np.cos(x[i])
    k2 = np.cos(x[i] + h/2)
    k3 = np.cos(x[i] + h/2)
    k4 = np.cos(x[i] + h)

    y1[i+1] = y1[i] + h*(k1 + 2*k2 + 2*k3 + k4)/6

y = np.sin(x)

plt.plot(x, y, 'k--', label='sin(x)')
plt.plot(x, y1, 'ro-', label='RK4')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()