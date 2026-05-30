def secant(f, x0, x1, tol=1e-6, max=50):
    for i in range(1, max + 1):
        denom = f(x1) - f(x0)
        if abs(denom) < 1e-15:
            print("The denominator can't be zero. Hence, method failed")
            return None
        x2 = x1 - f(x1) * (x1 - x0) / denom
        if abs(x2 - x1) < tol:
            print(f"Root = {x2}")
            return x2
        x0, x1 = x1, x2
    print("Did not converge")
    return None


def f(x):
    return x**3 - x - 2

secant(f, x0=1, x1=2)