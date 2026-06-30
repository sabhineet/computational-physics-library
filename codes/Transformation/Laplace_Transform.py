import numpy as np
import matplotlib.pyplot as plt

def f(t):
    return np.sin(t)

t = np.arange(0,50,0.05)

y = f(t)

s = np.linspace(0.1,3,100)

F = []

for i in s:

    z = y * np.exp(-i*t)

    F.append(np.trapezoid(z,t))

exact = 1/(s*s + 1)

plt.plot(s, exact, 'k--', label="Exact")
plt.plot(s, F, 'r.', label="Numerical")

plt.xlabel("s")
plt.ylabel("F(s)")
plt.legend()
plt.grid()
plt.show()