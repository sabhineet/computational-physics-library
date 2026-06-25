import numpy as np
import matplotlib.pyplot as plt

x = [0]
y = [0]

a = 0
b = 0
h = 0.5
e0 = 0.0001

while a < 10:

    if a + h > 10:
        h = 10 - a

    k1 = np.cos(a)
    k2 = np.cos(a + h/2)
    k3 = np.cos(a + h/2)
    k4 = np.cos(a + h)

    y4 = b + h*(k1 + 2*k2 + 2*k3 + k4)/6

    k5 = np.cos(a + h)

    y5 = b + h*(k1 + 4*k2 + k4 + k5)/6

    e = abs(y5 - y4)

    if e < e0:

        a = a + h
        b = y4

        x.append(a)
        y.append(b)

        h = h*1.5

    else:
        h = h/2

x1 = np.linspace(0, 10, 200)
y1 = np.sin(x1)

plt.plot(x1, y1, 'k--', label='sin(x)')
plt.plot(x, y, 'bo-', label='RK45')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()
plt.show()