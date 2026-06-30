import numpy as np
import matplotlib.pyplot as plt
import math

def f(x):
    return np.cos(x)

def d(n):

    if n % 4 == 0:
        return 1
    elif n % 4 == 1:
        return 0
    elif n % 4 == 2:
        return -1
    else:
        return 0

def taylor(x, n):

    y = 0

    for i in range(n+1):
        y = y + d(i)*(x**i)/math.factorial(i)

    return y

x = np.linspace(-6,6,200)

y = f(x)

y2 = [taylor(i,2) for i in x]
y4 = [taylor(i,4) for i in x]
y6 = [taylor(i,6) for i in x]

plt.plot(x,y,'k',label="cos(x)")
plt.plot(x,y2,'r--',label="Order 2")
plt.plot(x,y4,'g--',label="Order 4")
plt.plot(x,y6,'b--',label="Order 6")

plt.scatter(0,1)

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()