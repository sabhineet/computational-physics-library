def triangular(A, typ):

    n = len(A)

    if typ == "upper":

        for i in range(n):

            for j in range(i+1, n):

                factor = A[j][i] / A[i][i]

                for k in range(n):

                    A[j][k] = A[j][k] - factor * A[i][k]

    elif typ == "lower":

        for i in range(n-1, -1, -1):

            for j in range(i-1, -1, -1):

                factor = A[j][i] / A[i][i]

                for k in range(n):

                    A[j][k] = A[j][k] - factor * A[i][k]

    return A


A = [[1,2,3],
     [4,5,6],
     [7,8,10]]

choice = input("upper or lower : ")

for row in triangular(A, choice):
    print(row)