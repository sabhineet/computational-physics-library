import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,3,6,10])
y = np.array([2,1,5,3])
dy = np.array([-1,2,0,-2])

def hermite(x1):

    for i in range(len(x)-1):

        if x[i] <= x1 <= x[i+1]:

            h = x[i+1] - x[i]
            t = (x1 - x[i]) / h

            h1 = 2*t**3 - 3*t**2 + 1
            h2 = t**3 - 2*t**2 + t
            h3 = -2*t**3 + 3*t**2
            h4 = t**3 - t**2

            return h1*y[i] + h2*h*dy[i] + h3*y[i+1] + h4*h*dy[i+1]

x1 = np.linspace(1,10,200)

y1 = []

for i in x1:
    y1.append(hermite(i))

plt.scatter(x,y,label="Data")

for i in range(len(x)):
    plt.quiver(x[i], y[i], 1, dy[i], angles='xy', scale_units='xy', scale=3)

plt.plot(x1,y1,'r',label="Hermite")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()