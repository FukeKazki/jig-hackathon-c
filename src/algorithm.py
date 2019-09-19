import csv
import io
import pandas as pd
import pprint
import sys
import random

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

args = sys.argv[1:]

if len(args) == 0:
    exit(1)

data = pd.read_csv("./data/dummy.csv").values.tolist()

for row in data:
        # print("-------")
        # print(row[2])
        # print(row[3])
    if row[2] != '、':
        if len(row[3]) >= 2 :
            row[2] = random.choice(args)

st = ""                
for row in data:
    # print(row[2])
    st += row[2]
    
print(st)
    
    