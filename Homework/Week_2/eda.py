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


	df = df.replace(to_replace='unknown', value=None)
	df = df.replace(to_replace={'Pop. Density (per sq. mi.)':','}, value= '.')
	#df = df.replace(to_replace=',', value='.')

	for label, content in df.iteritems():
		if label is 'Pop. Density (per sq. mi.)':
			df[label] = df[label].replace(',','.')
			print(df[label])


    # Remove white spaces before and after strings	              
	'''for row in df.itertuples():
		print(row[0])
		#df[col] = df[col].str.strip()
		if col.any() == 'GDP ($ per capita) dollars':
			df[col] = df[col].str.strip(' dollars')
			df[col] = df[col].astype('int64', errors='ignore')
		if col.any() is 'Pop. Density (per sq. mi.)' and type() is str:
			row[col] = row[col].replace(',', '.')
		if col.any() is 'Infant mortality (per 1000 births)' and type() is str:
			row[col] = row[col].replace(',', '.')'''

	#df  = df.astype({'Infant mortality (per 1000 births)':float, 'Pop. Density (per sq. mi.)': float})



	#print(type(df.loc[0,'Pop. Density (per sq. mi.)']))
	#print(df['Infant mortality (per 1000 births)'])





	#print(df['GDP ($ per capita) dollars'].mean(skipna=True))






