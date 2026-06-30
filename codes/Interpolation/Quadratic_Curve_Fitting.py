import numpy as np
import matplotlib.pyplot as plt

x = np.array([-3,-2,-1,0,1,2,3])
y = np.array([9.2,4.3,1.1,0.2,0.9,3.8,9.1])

A = np.column_stack((x*x, x, np.ones(len(x))))

p = np.linalg.solve(A.T @ A, A.T @ y)

a = p[0]
b = p[1]
c = p[2]

print("a =", a)
print("b =", b)
print("c =", c)

x1 = np.linspace(-4,4,100)
y1 = a*x1*x1 + b*x1 + c

plt.scatter(x, y, label="Data")
plt.plot(x1, y1, 'g', label="Best Fit")

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()