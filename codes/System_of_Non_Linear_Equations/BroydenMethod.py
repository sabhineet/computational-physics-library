import math

def func(x):
  return [
      x[0]**2 + 2*x[1] + math.exp(x[2]) -2,
      x[0] + x[1]**2 + x[2]**3 -1,
      x[0] - 4*x[1] -2
  ]

def jacobian(x, num_eqns, num_vars,h=1e-5):
  n = num_eqns
  m = num_vars
  J = [[0]*m for _ in range(n)]
  for i in range(n):
    for j in range(m):
      x_plus = x.copy()
      x_minus = x.copy()
      x_plus[j] += h
      x_minus[j] -= h

      J[i][j] = (func(x_plus)[i] - func(x_minus)[i]) / (2*h)
  return J

def invert(A):
    dim = len(A)
    aug = [[float(A[i][j]) for j in range(dim)] + [1.0 if i == j else 0.0 for j in range(dim)] for i in range(dim)]
    
    for i in range(dim):
        pivot = aug[i][i]
        if abs(pivot) < 1e-10:
            return "Matrix is singular and cannot be inverted."
        for j in range(2 * dim):
            aug[i][j] /= pivot

        for k in range(dim):
            if k != i:
                factor = aug[k][i]
                for j in range(2 * dim):
                    aug[k][j] -= factor * aug[i][j]
    
    inv = [[aug[i][j] for j in range(dim, 2 * dim)] for i in range(dim)]
    return inv

def BroydenMethod(x0, J_inv, tol=1e-6, max_iter=100):
    x = x0
    for _ in range(max_iter):
        F = func(x)
        delta_x = [sum(J_inv[i][j] * F[j] for j in range(num_eqns)) for i in range(num_vars)]
        x = [x[i] - delta_x[i] for i in range(num_vars)]
        
        if math.sqrt(sum(dx**2 for dx in delta_x)) < tol:
            return x
        
        F_new = func(x)
        delta_F = [F_new[i] - F[i] for i in range(num_eqns)]
        J_inv = J_inv + (delta_x - )
    
    print("Maximum iterations reached without convergence.")



num_eqns = 3
num_vars = 3
x0 = [0.6,0.5,0.5]
J = jacobian(x0, num_eqns, num_vars)

num_eqns = 3
num_vars = 3
x0 = [0.6,0.5,0.5]
J = jacobian(x0, num_eqns, num_vars)
Jinv = invert(J)
solution = BroydenMethod(x0,Jinv)
print("Solution:", solution)
print("Function values at solution:", func(solution))