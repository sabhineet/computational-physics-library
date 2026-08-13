import random
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def calculate_energy(spin, L, J, g):
    energy = 0.0
    for i in range(L):
        for j in range(L):
            S = spin[i, j]
            nb = spin[(i+1)%L, j] + spin[i, (j+1)%L] + spin[(i-1)%L, j] + spin[i, (j-1)%L] #Periodic boundary conditions
            energy += -J * S * nb - g * S
    return energy / 2.0

def metropolis_step(spin, L, J, g, T, E, M):
    a = random.randint(0, L-1)
    b = random.randint(0, L-1)
    S = spin[a, b]
    nb = spin[(a+1)%L, b] + spin[a, (b+1)%L] + spin[(a-1)%L, b] + spin[a, (b-1)%L]
    dE = 2 * S * (J * nb + g)
    if dE < 0 or random.random() < np.exp(-dE / T):
        spin[a, b] *= -1
        E = E + dE
        M = M + 2 * spin[a, b]
    return spin, E, M


Tmax = 5.0
T = 1.0
dT = 0.1
L = 10

J = 1.0 #1 for ferromagnetic, -1 for antiferromagnetic
g = 0.0 #Relative strength of external field
sweeps = 5000 #number of Monte Carlo sweeps
eq_sweeps = int(0.2 * sweeps) #number of sweeps to reach equilibrium
N = L*L


Energy = []
Magnetization = []
Specific_heat = []
Susceptibility = []

while T < Tmax:
    spin = np.random.choice([-1, 1], size=(L, L)) #initial random configuration
    E = calculate_energy(spin, L, J, g)
    M = np.sum(spin)
    E_est = 0.0
    E2_est = 0.0
    M_est = 0.0
    M2_est = 0.0
    Mabs_est = 0.0

    nsamples = 0
    C = 0.0
    chi = 0.0

    for sweep in range(eq_sweeps):
        for i in range(L*L):
            spin,E,M = metropolis_step(spin, L, J, g, T, E, M)

    for sweep in range(sweeps):
        for i in range(L*L):
            spin,E,M = metropolis_step(spin, L, J, g, T, E, M)
        nsamples += 1
        E_est += E
        E2_est += E**2
        M_est += M
        M2_est += M**2
        Mabs_est += abs(M)

    E_est /= nsamples
    E2_est /= nsamples
    M_est /= nsamples
    M2_est /= nsamples
    Mabs_est /= nsamples

    C = (E2_est - E_est**2) / (T**2 * N)
    chi = (M2_est - M_est**2) / (T * N)

    Specific_heat.append(C)
    Susceptibility.append(chi)
    Energy.append(E_est)
    Magnetization.append(Mabs_est)

    print(f"T: {T:.2f}, E: {E_est:.4f}, M: {M_est:.4f}, |M|: {Mabs_est:.4f}, C: {C:.4f}, chi: {chi:.4f}")
    T += dT
    T = round(T, 1)  # Round T to avoid floating-point precision issues
    

plt.figure(figsize=(12, 5))
plt.subplot(3, 3, 1)
plt.plot(np.arange(1.0, Tmax, dT), Energy, marker='o', color='blue')
plt.title('Energy vs Temperature')
plt.xlabel('Temperature (T)')
plt.ylabel('Energy (E)')

plt.subplot(3, 3, 3)
plt.plot(np.arange(1.0, Tmax, dT), Magnetization, marker='o', color='red')
plt.title('Magnetization vs Temperature')
plt.xlabel('Temperature (T)')
plt.ylabel('Magnetization (|M|)')

plt.subplot(3, 3, 5)
sns.heatmap(spin, annot=False, cmap='coolwarm')
plt.title('Final Spin Configuration')

plt.subplot(3, 3, 7)
plt.plot(np.arange(1.0, Tmax, dT), Specific_heat, marker='o', color='green')
plt.title('Specific Heat vs Temperature')
plt.xlabel('Temperature (T)')
plt.ylabel('Specific Heat (C)')

plt.subplot(3, 3, 9)
plt.plot(np.arange(1.0, Tmax, dT), Susceptibility, marker='o', color='purple')
plt.title('Susceptibility vs Temperature')
plt.xlabel('Temperature (T)')
plt.ylabel('Susceptibility (χ)')

plt.show()