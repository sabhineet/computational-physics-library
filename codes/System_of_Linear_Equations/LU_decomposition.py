import numpy as np

def lu_decomposition(A, b):

    A = A.astype(float)
    b = b.astype(float)

    n = len(b)

    L = np.zeros((n, n))
    U = np.zeros((n, n))

    # LU Decomposition

    for i in range(n):

        # Upper triangular matrix

        for k in range(i, n):

            sum = 0

            for j in range(i):

                sum = sum + L[i][j] * U[j][k]

            U[i][k] = A[i][k] - sum

        # Lower triangular matrix

        for k in range(i, n):

            if i == k:

                L[i][i] = 1

            else:

                sum = 0

                for j in range(i):

                    sum = sum + L[k][j] * U[j][i]

                L[k][i] = (A[k][i] - sum) / U[i][i]

    # Forward substitution

    Y = np.zeros(n)

    for i in range(n):

        sum = 0

        for j in range(i):

            sum = sum + L[i][j] * Y[j]

        Y[i] = b[i] - sum

    # Back substitution

    X = np.zeros(n)

    for i in range(n - 1, -1, -1):

        sum = 0

        for j in range(i + 1, n):

            sum = sum + U[i][j] * X[j]

        X[i] = (Y[i] - sum) / U[i][i]

    return X


A = np.array([[2, 1, -1],
              [-3, -1, 2],
              [-2, 1, 2]])

b = np.array([8, -11, -3])

x = lu_decomposition(A, b)

print(x)
