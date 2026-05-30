def f(x):
    return x**3 - 6*x**2 + 9*x + 1

h = 0.0001
x = -1

while x <= 5:

    d1 = (f(x+h) - f(x-h)) / (2*h)

    if abs(d1) < 0.01:

        d2 = (f(x+h) - 2*f(x) + f(x-h)) / (h*h)

        print("Extremum near x =", round(x,3))
        print("f(x) =", round(f(x),3))

        if d2 > 0:
            print("Local Minimum")

        elif d2 < 0:
            print("Local Maximum")

        print()

    x += 0.01

#Plot

import matplotlib.pyplot as plt

def f(x):
    return x**3 - 6*x**2 + 9*x + 1

h = 0.0001

x_values = []
y_values = []

x = -1

while x <= 5:
    x_values.append(x)
    y_values.append(f(x))
    x += 0.01

plt.plot(x_values, y_values)

x = -1

while x <= 5:

    d1 = (f(x+h) - f(x-h)) / (2*h)

    if abs(d1) < 0.01:

        y = f(x)

        d2 = (f(x+h) - 2*f(x) + f(x-h)) / (h*h)

        if d2 > 0:
            plt.plot(x, y, 'go', label='Minimum')

        elif d2 < 0:
            plt.plot(x, y, 'ro', label='Maximum')


    x += 0.01

plt.xlabel("x")
plt.ylabel("f(x)")
plt.title("Maxima and Minima")
plt.grid()

plt.legend(loc='upper left')

plt.show()