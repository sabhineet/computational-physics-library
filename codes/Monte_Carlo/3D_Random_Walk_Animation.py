import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from IPython.display import HTML

num_steps = 1000

x = np.zeros(num_steps)
y = np.zeros(num_steps)
z = np.zeros(num_steps)

for i in range(1, num_steps):
    phi = np.random.uniform(0, 2 * np.pi)
    costheta = np.random.uniform(-1, 1)
    sintheta = np.sqrt(1 - costheta**2)

    x[i] = x[i - 1] + sintheta * np.cos(phi)
    y[i] = y[i - 1] + sintheta * np.sin(phi)
    z[i] = z[i - 1] + costheta

final_distance = np.sqrt(x[-1]**2 + y[-1]**2 + z[-1]**2)
expected_distance = np.sqrt(num_steps)

print(f"Total Steps Taken = {num_steps}")
print(f"Final Position = ({x[-1]:.2f}, {y[-1]:.2f}, {z[-1]:.2f})")
print(f"Distance from Origin = {final_distance:.2f}")
print(f"Expected Distance ≈ {expected_distance:.2f}")

fig = plt.figure(figsize=(8, 8))
ax = fig.add_subplot(111, projection="3d")

max_range = np.max(np.abs([x, y, z])) + 2

ax.set_xlim(-max_range, max_range)
ax.set_ylim(-max_range, max_range)
ax.set_zlim(-max_range, max_range)

ax.set_xlabel("X Position")
ax.set_ylabel("Y Position")
ax.set_zlabel("Z Position")
ax.set_title("3D Random Walk Simulation")

line, = ax.plot([], [], [], "r-", linewidth=1.5, alpha=0.6)

ax.scatter([0], [0], [0], color="green", s=80, label="Start")

particle, = ax.plot([], [], [], "bo", markersize=6)

def update(frame):
    line.set_data(x[:frame], y[:frame])
    line.set_3d_properties(z[:frame])

    particle.set_data([x[frame]], [y[frame]])
    particle.set_3d_properties([z[frame]])

    return line, particle

animation = FuncAnimation(
    fig,
    update,
    frames=range(0, num_steps, 5),
    interval=30,
    blit=False
)

plt.close()

HTML(animation.to_jshtml())