def f(x):
    return x*x

a = 0
b = 3
n = 6

h = (b-a)/n

s = f(a) + f(b)

for i in range(1,n):

    if i%3 == 0:
        s = s + 2*f(a+i*h)
    else:
        s = s + 3*f(a+i*h)

I = (3*h/8)*s

print("Integral =", I)