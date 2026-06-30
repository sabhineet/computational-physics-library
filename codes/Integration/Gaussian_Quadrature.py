import numpy as np
import matplotlib.pyplot as plt

def f(x):
    return x**3 - 2*x**2 + 5

def gauss2(f, a, b):

    x = np.array([-1/np.sqrt(3), 1/np.sqrt(3)])
    w = np.array([1, 1])

    h = (b-a)/2

    x = h*x + (a+b)/2

    area = h * np.sum(w * f(x))

    return area

def gauss3(f, a, b):

    x = np.array([-np.sqrt(3/5), 0, np.sqrt(3/5)])
    w = np.array([5/9, 8/9, 5/9])

    h = (b-a)/2

    x = h*x + (a+b)/2

    area = h * np.sum(w * f(x))

    return area

a = 0
b = 2

exact = 26/3

g2 = gauss2(f, a, b)
g3 = gauss3(f, a, b)

print("Exact =", exact)
print("2 Point =", g2)
print("3 Point =", g3)

x = np.linspace(a, b, 200)
y = f(x)

p = ((b-a)/2) * np.array([-1/np.sqrt(3), 1/np.sqrt(3)]) + (a+b)/2

plt.plot(x, y, label="f(x)")
plt.fill_between(x, y, alpha=0.2)
plt.scatter(p, f(p), color="red", label="Sampling Points")

plt.xlabel("x")
plt.ylabel("f(x)")
plt.legend()
plt.grid()
plt.show()