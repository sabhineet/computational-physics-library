import random
import math
import matplotlib.pyplot as plt


def inverse_cdf(u):
    lam = 3.0
    return -math.log(1 - u)/lam

lam = 3.0
n = 10000
samples = [inverse_cdf(random.uniform(0, 1)) for _ in range(n)]
mean_sample = sum(samples) / n
var_sample = sum((x - mean_sample) ** 2 for x in samples) / n
true_mean = 1 / lam
true_var = 1 / (lam ** 2)

print(f"Sample Mean: {mean_sample}, True Mean: {true_mean}")
print(f"Sample Variance: {var_sample}, True Variance: {true_var}")


plt.hist(samples, bins=30, density=True, alpha=0.6, color='g')
plt.xlabel('x')
plt.ylabel('Density')
plt.title('Histogram of Generated Samples vs. True Density')
plt.show()

