# Forward Difference

def f(x):
    return x*x + 2*x + 1

x = float(input("Enter x = "))
h = float(input("Enter h = "))

dy = (f(x+h) - f(x)) / h

print("Derivative =", dy)

# Backward Difference

def f(x):
    return x*x + 2*x + 1

x = float(input("Enter x = "))
h = float(input("Enter h = "))

dy = (f(x) - f(x-h)) / h

print("Derivative =", dy)

# Central Difference

def f(x):
    return x*x + 2*x + 1

x = float(input("Enter x = "))
h = float(input("Enter h = "))

dy = (f(x+h) - f(x-h)) / (2*h)

print("Derivative =", dy)