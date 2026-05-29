def newton_raphson(f, df, x0, tol=1e-6, max=50):
    x = x0
    for i in range(1, max + 1):
        fx  = f(x)
        dfx = df(x)
        if abs(dfx) < 1e-15:
            print("The denominator can't be zero. Hence, method failed")
            return None
        x_new = x - fx / dfx
        if abs(x_new - x) < tol:
            print(f"Root = {x_new}")
            return x_new
        x = x_new
    print("Did not converge")
    return None


def f(x):  return x**3 - x - 2
def df(x): return 3*x**2 - 1

newton_raphson(f, df, x0=1.5)