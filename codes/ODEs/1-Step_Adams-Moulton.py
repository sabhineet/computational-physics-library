import numpy as np
import matplotlib.pyplot as plt

h = 0.4
x = np.arange(0, 10, h)
n = len(x)

y = np.zeros(n)

for i in range(n-1):

    a = np.cos(x[i])
    b = np.cos(x[i+1])

    y[i+1] = y[i] + h*(a + b)/2

y1 = np.sin(x)

plt.plot(x, y1, 'k--', label='sin(x)')
plt.plot(x, y, 'bs-', label='1-Step Adams-Moulton (AM1) (Trapezoidal Method)')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()