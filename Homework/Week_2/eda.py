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

	#Replace 'unknown' by NaN such that other data 
	#will not be omited due to a single missing value             
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
	df  = df.astype({'GDP ($ per capita) dollars':float,'Infant mortality (per 1000 births)':float, 'Pop. Density (per sq. mi.)': float})
	
	return df


def central_tendacy(data):
	'''
	Analyze data and save descriptives to dict
	Plot histogram
	'''

	mean_ = round(data.mean(),1)
	median_ = round(data.median(),1)
	mode_ = data.mode()[0]

	descriptives = {
		'mean': mean_,
		'median': median_,
		'mode': mode_
	}


	ax = plt.subplot()
	# Set histogram properties
	ax.hist(x=data,
			bins=15,  
			alpha=0.7,
			edgecolor='white',
			color='red')

	# Remove right and top axis
	ax.spines['right'].set_visible(False)
	ax.spines['top'].set_visible(False)

	# Set titles and axes labels
	ax.set_title('Distribution of worldwide GDP')
	ax.set_xlabel('GDP ($ per capita)')
	ax.set_ylabel('Frequency')

	# The majority of GDP's is concentrated 
	# below 10.000 $ per capita
	# In other words this graph captures the 
	# extreme unequal devision of wealth
	plt.show()


	for key in descriptives:
		print(f'{data.name} {key}: {descriptives[key]}')


def five_num_sum(data):
	'''
	'''


	# Calculate Minimum, First Quartile, Median, Third Quartile and Maximum
	minimum = data.min()
	first_q = data.quantile(q=.25)
	median = data.median()
	maximum = data.max()
	third_q = data.quantile(q=.75)

	# Print descriptives
	print(f'Descrivtive statistics for {data.name}:\n'
		  f'Minimum = {minimum}\n'
		  f'First Quartile = {first_q}\n'
		  f'Median = {median}\n'
		  f'Third Quartile = {third_q}\n'
		  f'Maximum = {maximum}')

	data = [data]
	#Make boxplot
	fig1, ax1 = plt.subplots()
	ax1.boxplot(data)#, vert=False)
	ax1.set_ylabel('Deaths per 1000 births')
	ax1.set_ylim(bottom=0,top=200)
	#boxplot = data.plot.box()
	plt.show()

	return None

def WriteToJson(filename, path, data):

	filePathNameWExt = './' + path + '/' + filename 
	with open(filePathNameWExt, 'w') as fp:
		json.dump(data, fp)
 

if __name__ == "__main__":

	# Load raw data
	data = pd.read_csv(INPUT_FILE, sep=',')

	# Clean data
	df = clean_data(data)

	# Calculate statistics for GDP
	statistis = central_tendacy(df['GDP ($ per capita) dollars'])

	# 
	five_num_sum(df['Infant mortality (per 1000 births)'])

	# Change nan values to prepare for json conversion
	df= df.fillna("nan")

	# Convert dataframe to dict
	df_dict = df.set_index('Country').to_dict('index')

	# define path
	path = './'
	fileName = 'data.json'

	#write json file
	WriteToJson(fileName, path, df_dict)






	

	

	










