import random
import math
import matplotlib.pyplot as plt
random.seed(43)

def estimate_pi(num_samples):
    success = 0

    for _ in range(num_samples):
        x = 2*random.uniform(0,1)-1
        y = 2*random.uniform(0,1)-1
        distance = x**2 + y**2

        if distance <= 1:
            success += 1

    pi_estimate = (success / num_samples) * 4
    return pi_estimate

num = [1000, 10000, 100000, 1000000]
pi = math.acos(-1)
errors = []

for num_samples in num:
    pi_value = estimate_pi(num_samples)
    print(f"Estimated value of pi with {num_samples} samples: {pi_value}")
    print(f"Exact value of pi: {pi}")
    rel_error = abs(pi_value - pi) / pi * 100
    errors.append(rel_error)
    print(f" Relative Error: {rel_error}%\n")

plt.plot(num, errors, 'o-')
plt.xscale('log')
plt.xlabel('Number of Samples (log scale)')
plt.ylabel('Relative Error (%)')
plt.show()