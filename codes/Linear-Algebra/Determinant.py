def determinant(A, dim):
  if dim == 1:
        return A[0][0]

  if dim == 2:
        return A[0][0] * A[1][1] - \
               A[0][1] * A[1][0]

  result = 0
  for col in range(dim):

        sub = [[0] * (dim - 1) for _ in range(dim - 1)]
        for i in range(1, dim):
            subcol = 0
            for j in range(dim):

                if j == col:
                    continue

                sub[i - 1][subcol] = A[i][j]
                subcol += 1

        sign = 1 if col % 2 == 0 else -1
        result += sign * A[0][col] * determinant(sub, dim - 1)

  return result

dim = 3
A = [[1, 2, 3],
 [4, 5 ,6],
  [7, 8, 10]]
det = determinant(A, dim)
print(det)
