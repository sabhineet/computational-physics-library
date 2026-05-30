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

A = [[1, 2, 3],
 [4, 5 ,6],
  [7, 8, 10]]
inverse_A = invert(A)
print("Inverse of A:", inverse_A)