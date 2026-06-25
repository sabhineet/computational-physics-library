import random
import math
import matplotlib.pyplot as plt

random.seed(43)

def box_muller(mu, sigma):
    u1 = random.uniform(0, 1)
    u2 = random.uniform(0, 1)

    z0 = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)* sigma + mu
    z1 = math.sqrt(-2.0 * math.log(u1)) * math.sin(2.0 * math.pi * u2)* sigma + mu

    return z0, z1

n = 10000
mu = 5
sigma = 2
samples = [box_muller(mu, sigma) for _ in range(n)] 

mean = sum(x[0] for x in samples) / n
variance = sum((x[0] - mean) ** 2 for x in samples) / n

print(f"Mean of generated samples: {mean}", f"True Mean: {mu}")
print(f"Std Dev of generated samples: {math.sqrt(variance)}", f"True Std Dev: {sigma}")


plt.hist([x[0] for x in samples], bins=50, density=True, alpha=0.6, color='g')
x = [i * 0.1*sigma+mu for i in range(-30, 31)]
y = [1 / math.sqrt(2 * math.pi * sigma**2) * math.exp(-  (i - mu) ** 2 / (2 * sigma ** 2)) for i in x]
plt.plot(x, y, 'r-', linewidth=2)
plt.xlabel('Value')
plt.ylabel('Density')
plt.title('Box-Muller Method for Generating Normal Distribution')
plt.show()
 