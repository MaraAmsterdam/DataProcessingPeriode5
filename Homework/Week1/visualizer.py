#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from statistics import mean 

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":

    with open('movies.csv', newline='') as input_file:
    	reader = csv.DictReader(input_file)
    	for row in reader:
    		for key in data_dict:
    			if row['year'] == key:
    				data_dict[key].append(float(row['rating']))

    
