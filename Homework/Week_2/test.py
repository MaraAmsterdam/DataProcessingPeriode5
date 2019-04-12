import pandas as pd 
import csv

data = pd.read_csv("input.csv", sep= ',')

df = data.loc[:,['Pop. Density (per sq. mi.)',
				 'Infant mortality (per 1000 births)'
				 ]]

df = df.replace(to_replace= 'unknown', value='0')
df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)'].str.strip()

#df2 = df.astype({'Infant mortality (per 1000 births)':float, 'Pop. Density (per sq. mi.)': float})

for index, row in df.iterrows():	
	if type(row['Infant mortality (per 1000 births)']) is str:
		row['Infant mortality (per 1000 births)'] = row['Infant mortality (per 1000 births)'].replace(',', '.')
	if type(row['Pop. Density (per sq. mi.)']) is str:
		row['Pop. Density (per sq. mi.)'] = row['Pop. Density (per sq. mi.)'].replace(',','.')
	print(row['Infant mortality (per 1000 births)'])
	print(row['Pop. Density (per sq. mi.)'])
	#print(index)
	print("------------------------------------")

df  = df.astype({'Infant mortality (per 1000 births)':float, 'Pop. Density (per sq. mi.)': float})
print(type(df.loc[0,'Pop. Density (per sq. mi.)']))	
	#df[index] = df[index].replace(',', '.')

#print(df)
#df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)'].astype(float, errors='ignore')

