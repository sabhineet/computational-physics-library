import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,3,5,8,10])
y = np.array([2,1,4,3,7])

n = len(x)-1

h = np.diff(x)

A = np.zeros((n+1,n+1))
B = np.zeros(n+1)

A[0,0] = 1
A[n,n] = 1

for i in range(1,n):

    A[i,i-1] = h[i-1]
    A[i,i] = 2*(h[i-1]+h[i])
    A[i,i+1] = h[i]

    B[i] = 6*((y[i+1]-y[i])/h[i] - (y[i]-y[i-1])/h[i-1])

M = np.linalg.solve(A,B)

a = (M[1:]-M[:-1])/(6*h)
b = M[:-1]/2
c = (y[1:]-y[:-1])/h - (2*h*M[:-1] + h*M[1:])/6
d = y[:-1]

def spline(x1):

    for i in range(n):

        if x[i] <= x1 <= x[i+1]:

            t = x1 - x[i]

            return a[i]*t**3 + b[i]*t**2 + c[i]*t + d[i]

x1 = np.linspace(1,10,200)

y1 = []

for i in x1:
    y1.append(spline(i))

plt.scatter(x,y,label="Data")
plt.plot(x1,y1,'g',label="Spline")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()