import numpy as np
import matplotlib.pyplot as plt

def dft(y):

    n = len(y)
    Y = np.zeros(n, dtype=complex)

    for k in range(n):

        s = 0

        for i in range(n):

            a = -2*np.pi*k*i/n
            s = s + y[i]*(np.cos(a) + 1j*np.sin(a))

        Y[k] = s

    return Y

fs = 100

t = np.arange(0,1,1/fs)

y = np.sin(2*np.pi*5*t) + 0.5*np.sin(2*np.pi*20*t)

Y = dft(y)

f = np.arange(len(Y))*fs/len(Y)

m = np.abs(Y)

plt.figure(figsize=(10,6))

plt.subplot(2,1,1)
plt.plot(t,y)
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.title("Signal")

plt.subplot(2,1,2)
plt.stem(f[:len(f)//2], m[:len(m)//2])
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude")
plt.title("DFT")

plt.tight_layout()
plt.show()