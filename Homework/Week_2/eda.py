import csv
import pandas as pd 

INPUT_FILE = 'input.csv' 


if __name__ == "__main__":

	# Load raw data
	data = pd.read_csv(INPUT_FILE, sep=',')

	# Select data of interest
	df = data.loc[:,['Country',
	                 'Region',
	                 'Pop. Density (per sq. mi.)',
	                 'Infant mortality (per 1000 births)',
	                 'GDP ($ per capita) dollars']
	              ]

    # Remove white spaces before and after strings	              
	for col in df:
		df[col] = df[col].str.strip()

	for index, row in df.iterrows():
		if row.isna().any():
			print(row)






