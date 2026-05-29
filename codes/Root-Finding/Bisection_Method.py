def bisection(f, a, b, tol=1e-6, max=100):
    if f(a) * f(b) > 0:
        print("f(a) and f(b) must have opposite signs")
        return None
    for i in range(1, max + 1):
        c = (a + b) / 2
        if abs(f(c)) < tol or abs(b - a) / 2 < tol:
            print(f"Root = {c}")
            return c
        if f(a) * f(c) < 0:
            b = c
        else:
            a = c
    print("Did not converge")
    return None


def f(x):
    return x**3 - x - 2

bisection(f, a=1, b=2)