import numpy as np
import matplotlib.pyplot as plt

h = 0.5
x = np.arange(0, 10, h)
n = len(x)

y = np.zeros(n)

for i in range(3):

    k1 = np.cos(x[i])
    k2 = np.cos(x[i] + h/2)
    k3 = np.cos(x[i] + h/2)
    k4 = np.cos(x[i] + h)

    y[i+1] = y[i] + h*(k1 + 2*k2 + 2*k3 + k4)/6

for i in range(3, n-1):

    a = np.cos(x[i])
    b = np.cos(x[i-1])
    c = np.cos(x[i-2])
    d = np.cos(x[i-3])

    yp = y[i] + h*(55*a - 59*b + 37*c - 9*d)/24

    e = np.cos(x[i+1])

    y[i+1] = y[i] + h*(9*e + 19*a - 5*b + c)/24

y1 = np.sin(x)

plt.plot(x, y1, 'k--', label='sin(x)')
plt.plot(x, y, 'mo-', label='4-Step Adams PC (AB4-AM4)')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()