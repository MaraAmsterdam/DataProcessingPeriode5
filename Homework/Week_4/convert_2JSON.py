'''
Author: Mara Oosterbaan
Assigment: JSON converter
https://opendata.cbs.nl/#/CBS/nl/dataset/83049NED/table?ts=1556784445987
'''
import csv
import pandas as pd
import json
import glob

def write_to_json(filename, path, data):

	file_path_name_ext = './' + path + '/' + filename 
	with open(file_path_name_ext, 'w') as fp:
		json.dump(data, fp, indent=4)

def clean_data(data):

    # Select subset
	df = data.loc[0,"Burn-out klachten/Burn-out klachten (%)"]

	df = df.reset_index()
	df = df.rename({0:'15-25',
		1:'25-35',
		2:'35-45',
		3:'45-55',
		4:'55-65',
		5:'65-75'
		}, axis='index')
	df = df.drop(columns='index')

	# Change datatype
	df["Burn-out klachten/Burn-out klachten (%)"] = df["Burn-out klachten/Burn-out klachten (%)"].str.replace(',', '.')
	df = df.astype(dtype = 'float64')
	
	return df


def dict_convert(data):

	data_dict = data.to_dict('index')

	return data_dict


if __name__ == "__main__":

	data = pd.DataFrame()
	path = "/Users/maraoosterbaan/Data/DataProcessingPeriode5/Homework/Week_4/*.csv"
	for fname in glob.glob(path):
		data_raw = pd.read_csv(fname, sep = ';')
		data = data.append(data_raw)

	data_clean = clean_data(data)

	# Convert dataframe to dictionary
	data_dict = dict_convert(data_clean)

	path = '/'
	file_name = 'burnoutData.json'

	# Convert to JSON
	write_to_json(file_name, path, data_dict) 
