import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,2,3,4,5,6,7,8,9,10])
y = np.array([6.2, 8.8, 11.7, 14.5, 16.3, 19.2, 22.1, 24.0, 26.8, 29.6])

n = len(x)

sx = np.sum(x)
sy = np.sum(y)
sxx = np.sum(x*x)
sxy = np.sum(x*y)

m = (n*sxy - sx*sy)/(n*sxx - sx*sx)
c = (sy - m*sx)/n

print("Slope =", m)
print("Intercept =", c)

y1 = m*x + c

plt.scatter(x, y, label="Data")
plt.plot(x, y1, 'r', label="Best Fit")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()