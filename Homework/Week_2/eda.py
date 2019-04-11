import csv
import pandas as pd 

df = pd.read_csv('input.csv', sep=',')

print(df.loc[:,'Country'])




