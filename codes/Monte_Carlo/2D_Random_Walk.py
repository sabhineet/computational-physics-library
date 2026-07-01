import numpy as np
import matplotlib.pyplot as plt

n = 1000

sx = np.random.choice([-1, 1], n)
sy = np.random.choice([-1, 1], n)

x = np.insert(np.cumsum(sx), 0, 0)
y = np.insert(np.cumsum(sy), 0, 0)

xf = x[-1]
yf = y[-1]

r = np.sqrt(xf**2 + yf**2)

print("Final Position =", (xf, yf))
print("Distance =", r)
print("Expected =", np.sqrt(n))

plt.figure(figsize=(6,6))

plt.plot(x, y, 'o-', markersize=3)

plt.scatter(0, 0, s=50, label="Start")
plt.scatter(xf, yf, s=50, label="End")

plt.xlabel("X")
plt.ylabel("Y")
plt.title("2D Random Walk")

plt.legend()
plt.grid()
plt.axis("equal")

plt.show()