"""
Author: Mara Oosterbaan
Assigment: JSON converter
https://opendata.cbs.nl/#/CBS/nl/dataset/82612NED/table?ts=1557991823644
https://opendata.cbs.nl/#/CBS/nl/dataset/83021NED/table?ts=1557995680324
""" 
import csv
import pandas as pd
import json

def write_to_json(filename, path, data):

	file_path_name_ext = "./" + path + "/" + filename 
	with open(file_path_name_ext, "w") as fp:
		json.dump(data, fp, indent=4)


def select_data(df):

	data = []
	values = []

	for row in df.iterrows():

		if (row[0] == 'daily'):
			
			values.append({"year" : int(row[1].year),
								"value" : row[1].value})

		elif (row[0] == "weekly"):

			values.append({"year" : int(row[1].year),
						   "value" : row[1].value})

		else: 

			values.append({"year" : int(row[1].year),
						   "value" : row[1].value})


	data.extend([{"frequency" : "daily",
			    "values" : values[0:4]},
			    {"frequency": "weekly",
			    "values": values[4:8]},
			    {"frequency": "rarely",
			    "values": values[8:12]}])
	print(data)



	return data


if __name__ == "__main__":

	df = pd.read_csv("data/workoutFreqTest.csv", sep = ";", index_col=0)

	print(df)

	data = select_data(df)



	path = "/data"
	file_name = "workoutTest.json"

	# Convert to JSON
	write_to_json(file_name, path, data) 
