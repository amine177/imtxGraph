import matplotlib.pyplot as plt
import sys
import csv

x = []
y = []

with open(sys.argv[1], 'r') as csvfile:
    for row in csv.reader(csvfile, delimiter=' '):
        x.append(int(float(row[0])))
        y.append(int(float(row[1])))


plt.plot(x, y)
plt.show()
