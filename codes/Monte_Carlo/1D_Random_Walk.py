import numpy as np
import matplotlib.pyplot as plt

n = 3000
m = 30000

step = np.random.choice([-1, 1], (m, n))
pos = np.sum(step, axis=1)

avg = np.mean(pos)
std = np.std(pos)

print("Mean final position =", round(avg, 3))
print("Standard deviation =", round(std, 3))
print("Theoretical std =", round(np.sqrt(n), 3))

plt.figure(figsize=(10, 2))

plt.scatter(pos, np.zeros(m), s=5, alpha=0.3)

plt.xlabel("Position")
plt.yticks([])
plt.title("1D Random Walk")

plt.grid(axis="x", linestyle=":")
plt.show()