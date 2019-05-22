#!/usr/bin/env python
# Name: Mara Oosterbaan
# Student number: 10549579
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
	Parse data into dictionaries and 
	save dictionaries in list
    """

    # Initiate movies list
    movies = []

    # Iterate selected html lines 
    for match in dom.find_all('div', class_ = 'lister-item-content'):
        
        title = str(match.h3.a.text)

        rating_ = match.find('div', class_ = 'inline-block ratings-imdb-rating')
        rating = float(rating_.strong.get_text())
        year_ = str(match.h3.find('span', class_ = 'lister-item-year text-muted unbold').text)
        runtime_ = str(match.p.find('span', class_ = 'runtime').text)

        # join strings
        runtime_year = runtime_ + " " + year_

        # Remove characters from strings and convert to int
        runtime = int(re.findall(r'[0-9]+', runtime_year)[0])
        year = int(re.findall(r'[0-9]+', runtime_year)[1])

        # select subset of actors 
        subset = match.find('p', class_ = '').select('a[href*="_st_"]')

        # Initiate actors list
        actors = []
        # Iterate subset and add to list
        for actor in subset:
        	actors.append(actor.string.extract())
        # Join seperate strings into one
        actors = ', '.join(actors)


        # Create dictionary for movie
        movie_dict = {
        			  "title" : title, 
                      "rating" : rating, 
                      "year" : year, 
                      "runtime" : runtime,
                      "actors" : actors
        }

        # Append movie dict to movies list
        movies.append(movie_dict)
    
    return movies  


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')


    # extract movies
    movies = extract_movies(dom)
    
    # write the CSV file to disk
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
    	fieldnames = ['title', 'rating', 'year', 'actors', 'runtime']
    	writer = csv.DictWriter(output_file, fieldnames=fieldnames)

    	writer.writeheader()
    	for data in movies:
    		writer.writerow(data)
	    	