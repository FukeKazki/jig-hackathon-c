import csv
import pandas as pd
import pprint

data = pd.read_csv("./data/dummy2.csv").values.tolist()

print (data[3])

for row in data:
    print("-------")
    print(row[2])
    print(row[3])
    if 