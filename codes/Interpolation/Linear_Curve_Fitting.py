import numpy as np
import matplotlib.pyplot as plt

x = np.array([1,2,3,4,5,6])
y = np.array([2.1,3.9,6.2,8.1,9.9,12.1])

A = np.column_stack((x, np.ones(len(x))))

b = np.linalg.solve(A.T @ A, A.T @ y)

m = b[0]
c = b[1]

print("Slope =", m)
print("Intercept =", c)

x1 = np.linspace(0,7,100)
y1 = m*x1 + c

plt.scatter(x, y, label="Data")
plt.plot(x1, y1, 'r', label="Best Fit")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()