import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,1.5,2,2.5,3,3.5,4,4.5,5])
y = np.array([2.4,3.4,4.9,7.0,9.7,13.8,19.6,27.4,39.5])

Y = np.log(y)

n = len(x)

sx = np.sum(x)
sy = np.sum(Y)
sxx = np.sum(x*x)
sxy = np.sum(x*Y)

b = (n*sxy - sx*sy)/(n*sxx - sx*sx)

c = (sy - b*sx)/n

a = np.exp(c)

print("a =", a)
print("b =", b)

y1 = a*np.exp(b*x)

plt.scatter(x, y, label="Data")
plt.plot(x, y1, 'r', label="Best Fit")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()