import numpy as np
import matplotlib.pyplot as plt

n = 100000

x = np.random.uniform(0, 2, n)
y = np.random.uniform(0, 1, n)

f = np.exp(-x**2)

inside = y <= f

area = 2 * 1

I = area * np.sum(inside) / n

print("Integral =", I)
print("Actual =", 0.88208)

plt.figure(figsize=(6,5))

plt.scatter(x[inside], y[inside], s=1, label="Inside")
plt.scatter(x[~inside], y[~inside], s=1, label="Outside")

p = np.linspace(0,2,300)

plt.plot(p, np.exp(-p**2), 'k')

plt.plot([0,2,2,0,0],[0,0,1,1,0],'k--')

plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid()
plt.show()