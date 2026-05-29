import numpy as np

def gaussian_elimation(A, b):
  n = len(b)

  #Forward Elimination

  for i in range(n):
    for j in range(i+1, n):
      ratio = A[j, i] /  A[i, i]
      for k in range(i, n):
        A[j, k] -= ratio * A[i, k]
      b[j] -= ratio * b[i]

#Back Substitution
      x = np.zeros(n)
      x[n-1] = b[n-1] / A[n-1, n-1]
      for i in range(n-2, -1, -1):
        sum = 0
        for j in range(i+1, n):
          sum += A[i, j] * x[j]
        x[i] = (b[i] - sum) / A[i, i]
      return x

#Test Run
A = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 10]])
b = np.array([11, 12, 13])

x = gaussian_elimation(A, b)
print(x)
