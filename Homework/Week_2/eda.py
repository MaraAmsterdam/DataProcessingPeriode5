import csv
import pandas as pd 
import matplotlib.pyplot as plt
import numpy as np
import json


INPUT_FILE = 'input.csv' 

def clean_data(df):
	'''
	Load raw data and clean
	Return dataframe with clean data
	'''

	# Select data of interest
	df = data.loc[:,['Country',
	                 'Region',
	                 'Pop. Density (per sq. mi.)',
	                 'Infant mortality (per 1000 births)',
	                 'GDP ($ per capita) dollars']
    ]

	# Replace 'unknown' by NaN such that other data 
	# Will not be omited due to a single missing value             
	df = df.replace(to_replace='unknown', value=np.nan)
     
	for col in df:
		# Strip white spaces    
		df[col] = df[col].str.strip()
		# Strip 'dollars' for dtype conversion
		if col == 'GDP ($ per capita) dollars':
			df[col] = df[col].str.strip(' dollars')
			df[col] = df[col].replace(to_replace='400000', value=np.nan)
			
	for index, row in df.iterrows():	
		# Replace ',' by '.' to facilitate dtype conversion
		if type(row['Infant mortality (per 1000 births)']) is str:
			row['Infant mortality (per 1000 births)'] = row['Infant mortality (per 1000 births)'].replace(',', '.')
		if type(row['Pop. Density (per sq. mi.)']) is str:
			row['Pop. Density (per sq. mi.)'] = row['Pop. Density (per sq. mi.)'].replace(',','.')

	# Convert str to float
	df  = df.astype({
		'GDP ($ per capita) dollars':float,
		'Infant mortality (per 1000 births)':float,
		'Pop. Density (per sq. mi.)': float
	})
	
	return df

def print_stats(stat_dict, data):
	'''
	Function to print stat values
	from dictionary
	'''

	print(f'\n',
	      f'Descriptives for {data.name}')
	for key in stat_dict:
		print(f'{key} = {stat_dict[key]}')

def central_tendacy(data):
	'''
	Analyze data and save descriptives to dict
	Plot histogram
	'''

	# Remove missing values
	data = data.dropna()

	mean_ = round(data.mean(),1)
	median_ = round(data.median(),1)
	mode_ = data.mode()[0]

	descriptives_ct = {
	    'mean': mean_,
	    'median': median_,
	    'mode': mode_
	}

	# Print descriptives
	print_stats(descriptives_ct, data)

	# Initiate plot
	ax = plt.subplot()

	# Set histogram properties
	ax.hist(x=data,  
	    alpha=0.7,
	    edgecolor='white',
	    color='red'
    )

	# Remove right and top axis
	ax.spines['right'].set_visible(False)
	ax.spines['top'].set_visible(False)

	# Set titles and axes labels
	ax.set_title('Global distribution of GDP')
	ax.set_xlabel('GDP ($ per capita)')
	ax.set_ylabel('Frequency')

	'''
	The majority of GDP's is concentrated 
	below 10.000 $ per capita.
	In other words this graph captures the 
	extreme unequal devision of wealth
	'''

	plt.show()

def five_num_sum(data):
	'''
	Calculate set of statistics to explore data
	Includes boxplot
	'''

	# Drop missing value to optimize data
	data = data.dropna()

	# Calculate Minimum, First Quartile, Median, Third Quartile and Maximum
	minimum = data.min()
	first_q = data.quantile(q=.25)
	median = data.median()
	maximum = data.max()
	third_q = data.quantile(q=.75)

	descriptives_fns = {
	    'minumum': minimum,
	    'First Quartile': first_q,
	    'Median': median,
	    'Third Quartile': third_q,
	    'Maximum': maximum
	}
	# Print descriptives
	print_stats(descriptives_fns, data)

	# Create boxplot 
	ax1 = data.plot.box()
	ax1.set_ylabel('Infant deaths per 1000 births')
	plt.show()

	return None

def write_to_json(filename, path, data):

	file_path_name_ext = './' + path + '/' + filename 
	with open(file_path_name_ext, 'w') as fp:
		json.dump(data, fp)
 

if __name__ == "__main__":

	# Load raw data
	data = pd.read_csv(INPUT_FILE, sep=',')

	# Clean data
	df = clean_data(data)

	# Calculate statistics for GDP
	statistis = central_tendacy(df['GDP ($ per capita) dollars'])

	# Calculate Five Number Summary for infant mortality
	five_num_sum(df['Infant mortality (per 1000 births)'])

	# Change nan values to prepare for json conversion
	df= df.fillna("nan")

	# Convert dataframe to dict
	df_dict = df.set_index('Country').to_dict('index')

	# Define path
	path = './'
	file_name = 'data.json'

	# Write json file
	write_to_json(file_name, path, df_dict)






	

	

	










