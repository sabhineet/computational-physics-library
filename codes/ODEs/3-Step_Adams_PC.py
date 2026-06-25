import numpy as np
import matplotlib.pyplot as plt

h = 0.4
x = np.arange(0, 10, h)
n = len(x)

y = np.zeros(n)

for i in range(2):

    k1 = np.cos(x[i])
    k2 = np.cos(x[i] + h/2)
    k3 = np.cos(x[i] + h/2)
    k4 = np.cos(x[i] + h)

    y[i+1] = y[i] + h*(k1 + 2*k2 + 2*k3 + k4)/6

for i in range(2, n-1):

    a = np.cos(x[i])
    b = np.cos(x[i-1])
    c = np.cos(x[i-2])

    yp = y[i] + h*(23*a - 16*b + 5*c)/12

    d = np.cos(x[i+1])

    y[i+1] = y[i] + h*(5*d + 8*a - b)/12

y1 = np.sin(x)

plt.plot(x, y1, 'k--', label='sin(x)')
plt.plot(x, y, 'g^-', label='3-Step Adams PC (AB3-AM3)')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()