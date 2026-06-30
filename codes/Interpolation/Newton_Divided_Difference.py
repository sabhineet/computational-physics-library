import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,3,5,8,10])
y = np.array([2,1,4,3,7])

n = len(x)

a = np.zeros((n,n))
a[:,0] = y

for j in range(1,n):
    for i in range(n-j):
        a[i,j] = (a[i+1,j-1]-a[i,j-1])/(x[i+j]-x[i])

c = a[0]

def newton(x1):

    y1 = c[0]
    p = 1

    for i in range(1,n):
        p = p*(x1-x[i-1])
        y1 = y1 + c[i]*p

    return y1

x1 = np.linspace(1,10,200)

y1 = []

for i in x1:
    y1.append(newton(i))

plt.scatter(x,y,label="Data")
plt.plot(x1,y1,'m',label="Newton")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()