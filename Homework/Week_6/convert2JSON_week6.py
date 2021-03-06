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

	for row in df.iterrows():
		temp = {"workoutfreq": row[1].name}
		temp.update(row[1])
		data.append(temp)

	return data


if __name__ == "__main__":

	df = pd.read_csv("data/happinessWorkout.csv", sep = ",", index_col=0)

	data = select_data(df)


	path = "/data"
	file_name = "workout_2016.json"

	# Convert to JSON
	write_to_json(file_name, path, data)  
