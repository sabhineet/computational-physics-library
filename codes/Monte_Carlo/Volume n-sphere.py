import random
import math

random.seed(42)

def estimate_volume_n_sphere(dim, num_samples, radius):
    success = 0
    for _ in range(num_samples):
        point = [radius*(2.0*random.uniform(0, 1)-1.0) for _ in range(dim)]
        if sum(x**2 for x in point) <= radius**2:
            success += 1

    volume_cube = (2 * radius) ** dim
    volume_sphere = (success / num_samples) * volume_cube
    return volume_sphere

dim = 3
num_samples = 10000
radius = 1.0
num_ensembles = 10
avg_volume = 0
vol2 = 0

for _ in range(num_ensembles):
    volume = estimate_volume_n_sphere(dim, num_samples, radius)
    avg_volume += volume
    vol2 += volume**2

avg_volume /= num_ensembles
std_dev = math.sqrt(vol2 / num_ensembles - avg_volume**2)

exact = math.acos(-1)**(dim/2) * (radius ** dim) / math.gamma(dim / 2 + 1)

relative_error = abs(avg_volume - exact) / exact * 100

print(f"Estimated Volume of {dim}-sphere over {num_ensembles} ensembles with {num_samples} samples: {avg_volume}+-{std_dev}")
print(f"Exact Volume of {dim}-sphere: {exact}")
print(f"Relative Error: {relative_error:.2f}%")