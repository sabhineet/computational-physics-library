import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,3,5,8,10])
y = np.array([2,1,4,3,7])

def linear(x1):

    for i in range(len(x)-1):

        if x[i] <= x1 <= x[i+1]:

            y1 = y[i] + (y[i+1]-y[i])*(x1-x[i])/(x[i+1]-x[i])

            return y1

x1 = np.linspace(1,10,200)

y1 = []

for i in x1:
    y1.append(linear(i))

plt.scatter(x,y,label='Data')
plt.plot(x1,y1,'r',label='Interpolation')

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()