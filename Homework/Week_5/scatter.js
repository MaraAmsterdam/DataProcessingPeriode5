/*
Author: Mara Oosterbaan
Assignment: Scatterplot
*/

var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"

var requests = [d3.json(teensInViolentArea),
 				d3.json(teenPregnancies),
 				d3.json(GDP)
 ];

/*function selectData(data, dataselectie){

	console.log(data);
	console.log(dataselectie);
    
    Object.values(data.dataselectie).forEach(function(dataset) {
    	//console.log(dataset);
    	for (var i = 0; i < Object.values(dataset).length; i++){
    		//console.log(Object.values(dataset)[i]);
    		if ((Object.values(dataset)[i].Time == "2012") || (Object.values(dataset)[i].Year == "2012")){
    			console.log(Object.values(dataset)[i].Country + ": " + Object.values(dataset)[i].Datapoint);
    		}
    	}	
	});
}*/ 

Promise.all(requests).then(function(response) {


	// Create data Object
    var dataScatterplot = {
      dataViolent : transformResponse(response[0]),
      dataPregnancies : transformResponse(response[1]),
      dataGDP : transformResponseV2(response[2])
    };
    var body = d3.select("body");
 	
 	var dataStruct = {
 					  "2012" : [],
 					  "2013" :[]
 	}
 		selectedData = {};



    Object.values(dataScatterplot.dataGDP).forEach(function(dataset) {
    	for (var i = 0; i < Object.values(dataset).length; i++){
    		//console.log(Object.values(dataset)[i]);
    		if ((Object.values(dataset)[i].Time == "2012") || (Object.values(dataset)[i].Year == "2012")){
    			
    			// Create variables to add to dict
    			var country = Object.values(dataset)[i].Country;
    			var datapointG = Object.values(dataset)[i].Datapoint
    			selectedData[country] = {"datapointG" : datapointG};
    			
    		}

    	}
    });

    Object.values(dataScatterplot.dataViolent).forEach(function(dataset) {
    	//console.log(dataset);
    	for (var i = 0; i < Object.values(dataset).length; i++){
    		//console.log(Object.values(dataset)[i]);
    		if ((Object.values(dataset)[i].Time == "2012") || (Object.values(dataset)[i].Year == "2012")){
    			
    			var country = Object.values(dataset)[i].Country;
    			var datapointV = Object.values(dataset)[i].Datapoint

    			// Add datapoint to excisting country
    			if (selectedData[country]) {
    		 		Object.assign(selectedData[country], {"datapointV" : datapointV});
    			}
    		}

    	}	
    });

    Object.values(dataScatterplot.dataPregnancies).forEach(function(dataset) {

    	for (var i = 0; i < Object.values(dataset).length; i++){

    		if ((Object.values(dataset)[i].Time == "2012") || (Object.values(dataset)[i].Year == "2012")){
    			
    			//console.log(Object.values(dataset)[i].Country + ": " + Object.values(dataset)[i].Datapoint);
    			var country = Object.values(dataset)[i].Country;
    			var datapointP = Object.values(dataset)[i].Datapoint

    			if (selectedData[country]) {
    		 	Object.assign(selectedData[country], {"datapointP" : datapointP});
    			}
    		}

    	}
    });


	Object.keys(selectedData).forEach(function(k){
		var k = k;
	});

	

	

	


    
    /*
    for (var j = 0; j < Object.keys(dataScatterplot).length; j++){
    	dataset = Object.keys(dataScatterplot)[j];
    	console.log(dataset);
    	// .dataset does not work; due to asynchronity?
		Object.values(dataScatterplot.dataset).forEach(function(subset) {
		//console.log(dataset);
			for (var i = 0; i < Object.values(subset).length; i++){
				//console.log(Object.values(dataset)[i]);
				if ((Object.values(subset)[i].Time == "2012") || (Object.values(subset)[i].Year == "2012")){
					console.log(Object.values(subset)[i].Country + ": " + Object.values(subset)[i].Datapoint);
				}
			}
		}); 
	}
	*/
 
}).catch(function(e){
    throw(e);
});