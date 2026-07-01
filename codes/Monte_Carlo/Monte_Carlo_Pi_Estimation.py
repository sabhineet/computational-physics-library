import numpy as np
import matplotlib.pyplot as plt

n = 10000

x = np.random.uniform(-1, 1, n)
y = np.random.uniform(-1, 1, n)

r = x**2 + y**2

inside = r <= 1
outside = r > 1

hit = np.sum(inside)
pi = 4 * hit / n

print("Total Darts =", n)
print("Hits =", hit)
print("Estimated Pi =", round(pi, 4))
print("Actual Pi =", round(np.pi, 4))
print("Error =", round(abs(pi - np.pi), 4))

plt.figure(figsize=(7, 7))

plt.scatter(x[inside], y[inside], s=2, color="blue", alpha=0.6, label="Inside")
plt.scatter(x[outside], y[outside], s=2, color="red", alpha=0.6, label="Outside")

c = plt.Circle((0, 0), 1, fill=False, color="black", linewidth=2)
plt.gca().add_patch(c)

plt.title("Monte Carlo Pi Estimation")
plt.xlabel("X")
plt.ylabel("Y")
plt.xlim(-1.05, 1.05)
plt.ylim(-1.05, 1.05)

plt.legend()
plt.grid(True, linestyle=":")
plt.gca().set_aspect("equal")

plt.show()