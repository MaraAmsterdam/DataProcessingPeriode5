import csv
import pandas as pd 
import matplotlib.pyplot as plt


INPUT_FILE = 'input.csv' 

def clean_data(df):

	# Select data of interest
	df = data.loc[:,['Country',
	                 'Region',
	                 'Pop. Density (per sq. mi.)',
	                 'Infant mortality (per 1000 births)',
	                 'GDP ($ per capita) dollars']
	              ]

	#Replace 'unknown' by NaN such that other data 
	#will not be omited due to a single missing value             
	df = df.replace(to_replace='unknown', value=None)
 
 	      
	for col in df:
		# Strip white spaces    
		df[col] = df[col].str.strip()
		# Strip 'dollars' for dtype conversion
		if col == 'GDP ($ per capita) dollars':
			df[col] = df[col].str.strip(' dollars')
			

	for index, row in df.iterrows():	
		# Replace ',' by '.' to facilitate dtype conversion
		if type(row['Infant mortality (per 1000 births)']) is str:
			row['Infant mortality (per 1000 births)'] = row['Infant mortality (per 1000 births)'].replace(',', '.')
		if type(row['Pop. Density (per sq. mi.)']) is str:
			row['Pop. Density (per sq. mi.)'] = row['Pop. Density (per sq. mi.)'].replace(',','.')

	# Convert str to float
	df  = df.astype({'GDP ($ per capita) dollars':float,'Infant mortality (per 1000 births)':float, 'Pop. Density (per sq. mi.)': float})
	
	return df

def central_tendacy(data):

	mean_ = round(data.mean(),1)
	median_ = round(data.median(),1)
	mode_ = data.mode()[0]

	descriptives = {
		'mean': mean_,
		'median': median_,
		'mode': mode_
	}

	return descriptives



if __name__ == "__main__":

	# Load raw data
	data = pd.read_csv(INPUT_FILE, sep=',')

	df = clean_data(data)

	statistis = central_tendacy(df['GDP ($ per capita) dollars'])

	print(statistis['mean'])










