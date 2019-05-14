/*
Author: Mara Oosterbaan
Assignment: Scatterplot
*/

var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017";
var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017";
var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions";

var requests = [d3.json(teensInViolentArea),
 				d3.json(teenPregnancies),
 				d3.json(GDP)
 ];

function selectData(data, keys, years){

	var dataStruct = {
					  "2012" : [],
					  "2013" : [],
					  "2014" : [],
					  "2015" : []
	};
	var countries = [];
	//console.log(data);



	//console.log(data.dataViolent.hasOwnProperty("Australia"));
	
	for (var y = 0; y < years.length; y++){


		var selectedData = {};
		var dataset = data[keys[0]];


	    	for (var i = 0; i < Object.values(dataset).length; i++){
	    		var subset = Object.values(dataset)[i]
	    		
	    		for (var r = 0; r < subset.length; r++){;

		    		if (Object.values(subset)[r].Time == years[y] || Object.values(subset)[r].Year == years[y]){

		    			// initiate dataset variables
		    			var country = Object.values(subset)[r].Country;
		    			var datapoint = Object.values(subset)[r].Datapoint
		    			var name = "datapoint" + keys[0];

		    			// Add variables to dict
	    				selectedData = { ["country"] : country,
	    				 				 [name] : datapoint
	    				 };
    				}
    			}
    		// Push dict in array of dataStruct
    		Object.assign(dataStruct[years[y]]).push(selectedData);
    		}
	}


	console.log(countries);

	for (y = 0; y < years.length; y++){
		for (var k = 0; k < dataStruct[years[y]].length; k++){
			// console.log(data.dataViolent.hasOwnProperty(dataStruct["2012"][k]["country"]))
			if (data.dataViolent.hasOwnProperty(dataStruct[years[y]][k]["country"]) && data.dataPregnancies.hasOwnProperty(dataStruct[years[y]][k]["country"])){
				countries.push(dataStruct[years[y]][k]["country"]);
			}
			else {
				dataStruct[years[y]].splice(k, 1);
				//splice method moves all indices the value of k
				//needs to be adjusted to ensure correct selection
				k--;
			}
		}
	}

	console.log(dataStruct);


	
	for (var y = 0; y < years.length; y++){

		// Iterate datasets
		for (var j = 1; j < keys.length; j++){
			var dataset = data[keys[j]];
			//console.log(dataset);


			// Check if countries in initial dataStruct
			for(c = 0; c < countries.length; c++){

				if (dataset.hasOwnProperty(countries[c])){

					// Select relevant subset
					selection = dataset[countries[c]];
					
					// Iterate subset array
					for (m = 0; m < selection.length; m++){


						// Select relevant year
						if (selection[m].Time == years[y] || selection[m].Year == years[y]){
		    			
		    			// initiate dataset variables
		    			var country = selection[m].Country;
		    			var datapoint = selection[m].Datapoint
		    			var name = "datapoint" + keys[j];

		    		
		    			for(var t = 0; t < dataStruct[years[y]].length; t++){ 

		    				if (dataStruct[years[y]][t]["country"] == country){

			    				dataStruct[years[y]][t][name] = datapoint;
			    				 };
			    			}
		    			}
						

					}
			
				}

			}
		}
	}	

	console.log(dataStruct);

	return dataStruct;		 
}

Promise.all(requests).then(function(response) {


	// Create data Object
    var dataScatterplot = {
      dataGDP : transformResponseV2(response[2]),    	
      dataViolent : transformResponse(response[0]),
      dataPregnancies : transformResponse(response[1])
    };
 	var keys = Object.keys(dataScatterplot);
 	var selectedData = selectData(dataScatterplot, keys, ["2012","2013","2014","2015"]);
 	//console.log(selectedData);
 	//console.log(selectedData["2012"][0].Australia.hasOwnProperty("datapointdataPregnancies"));
 
}).catch(function(e){
    throw(e);
});