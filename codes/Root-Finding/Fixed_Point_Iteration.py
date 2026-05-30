def fixed_point(f, x, tol=1e-6, max=100):
    for i in range(1, max + 1):
        x_next = f(x)
        if abs(x_next - x) < tol:
            print(f"Root = {x_next}")
            return x_next
        x = x_next

    print("Did not converge")
    return None

def f(x):
    return (x + 2) ** (1/3)

fixed_point(f, x=1.5)