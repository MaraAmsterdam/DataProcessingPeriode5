'''
Author: Mara Oosterbaan
Assigment: JSON converter
'''
import csv
import pandas as pd
import json

def write_to_json(filename, path, data):

	file_path_name_ext = './' + path + '/' + filename 
	with open(file_path_name_ext, 'w') as fp:
		json.dump(data, fp, indent=4)

def clean_data(data):

	# Remove NaNs
	df = data.dropna()
    

    # Change datatypes float64 to int64
	df = df.astype({'kamers': int, 
		'bedden': int,
		'gasten  (x 1.000)': int,
		'overnachtingen  (x 1.000)': int,
		'gemidd. bedbezetting (%)': int,
		'jaar': int
		}
	)

	# Select subset of data
	df = df.loc[df['hotel type'] == 'totaal'] 
    
	# Change index to be 'year'
	df = df.set_index(['jaar'])

	return df

def dict_convert(data):

	data_dict = data.to_dict('index')

	return data_dict


if __name__ == "__main__":

	# Open csv as pandas df
	data = pd.read_csv('2018_jaarboek_838.CSV', sep = ';')

	data_clean = clean_data(data)

	# Convert dataframe to dictionary
	data_dict = dict_convert(data_clean)

	path = '/'
	file_name = 'data.json'

	# Convert to JSON
	write_to_json(file_name, path, data_dict)
