import sys
import random


u0 = int(sys.argv[1])

memo = {1: 0}
def syracuse(n):
    if n in memo.keys():
        return memo[n]
    else:
        if n % 2 == 0:
            memo[n] = 1 + syracuse(n / 2)
        else:
            memo[n] = 1 + syracuse(3 * n + 1)
        return memo[n]


def tests(initial_value, neighborhood, nbtests):
    total = 0
    for _ in range(nbtests):
        total += syracuse(initial_value + random.randint(-neighborhood, neighborhood))

    return total / nbtests

print(u0, tests(u0, 50000, 10000))
