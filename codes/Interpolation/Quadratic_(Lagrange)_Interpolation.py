import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,3,5,8,10])
y = np.array([2,1,4,3,7])

def quad(x1):

    for i in range(len(x)-2):

        if x[i] <= x1 <= x[i+2]:

            a = y[i] * (x1-x[i+1])*(x1-x[i+2]) / ((x[i]-x[i+1])*(x[i]-x[i+2]))

            b = y[i+1] * (x1-x[i])*(x1-x[i+2]) / ((x[i+1]-x[i])*(x[i+1]-x[i+2]))

            c = y[i+2] * (x1-x[i])*(x1-x[i+1]) / ((x[i+2]-x[i])*(x[i+2]-x[i+1]))

            return a+b+c

    return y[-2] + (y[-1]-y[-2])*(x1-x[-2])/(x[-1]-x[-2])

x1 = np.linspace(1,10,200)

y1 = []

for i in x1:
    y1.append(quad(i))

plt.scatter(x,y,label="Data")
plt.plot(x1,y1,'g',label="Quadratic")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()