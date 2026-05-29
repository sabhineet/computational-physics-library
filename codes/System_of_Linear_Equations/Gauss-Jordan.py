import numpy as np

def gauss_jordan(A, b):

    A = A.astype(float)
    b = b.astype(float)

    n = len(b)

    for i in range(n):

        pivot = A[i][i]

        A[i] = A[i] / pivot
        b[i] = b[i] / pivot


        for k in range(n):

            if k != i:

                factor = A[k][i]

                A[k] = A[k] - factor * A[i]
                b[k] = b[k] - factor * b[i]

    return b


A = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 10]])

b = np.array([11, 12, 13])

x = gauss_jordan(A, b)

print(x)
