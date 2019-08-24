import csv
import pandas as pd
import pprint

data = pd.read_csv("./data/dummy.csv").values.tolist()

print (data)
