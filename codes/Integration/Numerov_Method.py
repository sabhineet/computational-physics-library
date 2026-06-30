import numpy as np
import matplotlib.pyplot as plt

k = 2

def f(t):
    return -k**2

t = np.arange(0,10,0.2)

h = t[1] - t[0]

y = np.zeros(len(t))

y[0] = 0

dy = k

y[1] = y[0] + h*dy + 0.5*h*h*f(t[0])*y[0]

for i in range(1,len(t)-1):

    a = 1 - h*h*f(t[i-1])/12
    b = 2 + 10*h*h*f(t[i])/12
    c = 1 - h*h*f(t[i+1])/12

    y[i+1] = (b*y[i] - a*y[i-1]) / c

x = np.linspace(0,10,300)

plt.plot(x, np.sin(2*x), 'k--', label="Exact")
plt.plot(t, y, 'ro-', label="Numerov")

plt.xlabel("t")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()