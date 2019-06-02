import sys


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


print(u0, syracuse(u0))
