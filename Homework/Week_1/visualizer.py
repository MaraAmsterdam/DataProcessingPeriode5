#!/usr/bin/env python
# Name: Mara Oosterbaan
# Student number: 10549579
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


def plot(dict_):
    '''
    Plots data
    '''

    # Create plot from data
    lines = plt.plot(dict_.keys(), dict_.values())
    # specify line color and markers to emphasize the seperate data points
    plt.setp(lines, color='b', marker='o')
    # Adjust y-axis scale to correct for distorted auto scale
    plt.ylim(0,10)
    # Add main title and axes labels
    plt.title('Average movie rating between 2008-2017')
    plt.xlabel('Time in years')
    plt.ylabel('Average rating (source: IMDB)')
    plt.show()


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
    
    #Plot data
    plot(data_dict)


 

