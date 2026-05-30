def f(x):
    return x*x

a = 0
b = 2
n = 4

h = (b-a)/n

s = f(a) + f(b)

for i in range(1,n):
    s = s + 2*f(a+i*h)

I = (h/2)*s

print("Integral =", I)