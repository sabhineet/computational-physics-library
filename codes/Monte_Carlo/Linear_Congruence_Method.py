import matplotlib.pyplot as plt

def lcg(xo, a, c, m, n):
    random_numbers = []
    for _ in range(n):
        xn = (a * xo + c) % m
        random_numbers.append(xn/m)
        xo = xn
    return random_numbers


xo  = 5
a   = 13
c   = 3
m = 2**31

mean = 0.5
var = 1/12

n = 100
while(n<1e6):
    random_numbers = lcg(xo, a, c, m, n)
    mean_calc = sum(random_numbers)/len(random_numbers)
    var_calc = sum((x - mean_calc)**2 for x in random_numbers)/len(random_numbers)
    mean_err = abs(mean_calc - mean)/mean
    var_err = abs(var_calc - var)/var
    #print(random_numbers)
    print(f"Mean: {mean_calc}, Expected: {mean}, Relative Error %: {mean_err*100:.2f}%")
    print(f"Variance: {var_calc}, Expected: {var}, Relative Error %: {var_err*100:.2f}%")
    n *= 10

plt.hist(random_numbers, bins=100, edgecolor='black')
plt.title('Histogram of Generated Random Numbers')
plt.show()

