import numpy as np
import matplotlib.pyplot as plt

h = 0.4
x = np.arange(0, 10, h)
n = len(x)

y1 = np.zeros(n)
y2 = np.zeros(n)

for i in range(n-1):
    y1[i+1] = y1[i] + h*np.cos(x[i])
    y2[i+1] = y2[i] + h*np.cos(x[i+1])

y = np.sin(x)

plt.plot(x, y, 'k--', label='sin(x)')
plt.plot(x, y1, 'ro-', label='Forward Euler')
plt.plot(x, y2, 'bs-', label='Backward Euler')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()