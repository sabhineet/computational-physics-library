import numpy as np
import matplotlib.pyplot as plt

h = 0.1
x = np.arange(0, 10, h)
n = len(x)

y = np.zeros(n)

for i in range(n):

    t = x[i]

    s = np.linspace(0, t, i+1)

    f = np.cos(s)

    g = np.exp(-(t-s))

    y[i] = np.trapz(g*f, s)

y1 = 0.5*(np.cos(x) + np.sin(x) - np.exp(-x))

plt.plot(x, y1, 'k--', label='Exact')
plt.plot(x, y, 'go-', label='Green Function')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()