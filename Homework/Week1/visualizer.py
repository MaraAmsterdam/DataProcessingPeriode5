#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from statistics import mean
from decimal import * 

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


if __name__ == "__main__":

	# Open csv file movies.csv
    with open(INPUT_CSV, newline='') as input_file:
    	reader = csv.DictReader(input_file)
    	# Iterate rows
    	for row in reader:
    		for key in data_dict:
    			# Check if year of row matches year of data_dict key
    			if row['year'] == key:
    				# Append rating to data_dict
    				data_dict[key].append(float(row['rating']))

    #Replace ratings by mean rating per year
    for key in data_dict:
    	mean_ = round(mean(data_dict[key]),1)
    	data_dict[key] = mean_
    print(data_dict)

    plt.plot(data_dict.keys(), data_dict.values())
    plt.ylim(0,10)
    plt.title("Mean movie ratings per year")
    plt.xlabel('Time in years')
    plt.ylabel('Average rating')
    plt.show()
    	
 

