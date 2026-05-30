import numpy as np

def gauss_seidel(A, b, iterations):

    A = A.astype(float)
    b = b.astype(float)

    n = len(b)

    x = np.zeros(n)

    for k in range(iterations):

        for i in range(n):

            sum = 0

            for j in range(n):

                if j != i:

                    sum = sum + A[i][j] * x[j]

            x[i] = (b[i] - sum) / A[i][i]

    return x


A = np.array([[10, 1, 1],
              [2, 10, 1],
              [2, 2, 10]])

b = np.array([12, 13, 14])

x = gauss_seidel(A, b, 10)

print(x)
