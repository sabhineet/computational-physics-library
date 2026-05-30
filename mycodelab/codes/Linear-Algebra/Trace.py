def trace(A,dim):
  return sum(A[i][i] for i in range(0 ,dim))

dim = 3
A = [[1, 2, 3],
 [4, 5 ,6],
  [7, 8, 9]]
print(trace(A,dim))
