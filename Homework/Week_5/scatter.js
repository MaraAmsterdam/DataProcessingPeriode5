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



for (y = 0; y < years.length; y++){
	for (var k = 0; k < dataStruct[years[y]].length; k++){
		
		// Select countries which have datapoints for all three sets 
		if (data.dataViolent.hasOwnProperty(dataStruct[years[y]][k]["country"]) && data.dataPregnancies.hasOwnProperty(dataStruct[years[y]][k]["country"])){
			countries.push(dataStruct[years[y]][k]["country"]);
		}
		// Remove countries from dataStruct which don't have all three datapoints
		else {
			dataStruct[years[y]].splice(k, 1);
			//splice method moves all indices the value of k
			//needs to be adjusted to ensure correct selection
			k--;
		}
	}
}


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

return dataStruct;		 
}

function createDataPointList(data){
/*
Create lst[[x,y],
		   [x,y]
		   ...
		]
*/
lst = []
var k = Object.keys(data);


for (var i = 0; i < k.length; i++){
	lstSub = [];
	for (var j = 0; j < data[k[i]].length; j++){
		var x = data[k[i]][j]["datapointdataPregnancies"];	
		var y = data[k[i]][j]["datapointdataGDP"];
		//var z = data[k[i]][j]["datapointdataViolent"];
		lstSub.push([x,y]);
	}
	lst.push(lstSub);
}
return lst;
}
function createScatterplot(lst){

var data = lst;
// Create margins
var margin = {top: 30, right: 20, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// Setup X 
var xValue = function(d){ return d[0];},
	xScale = d3.scaleLinear().range([margin.left, width]),
	xMap = function(d) { return xScale(xValue(d)); },
	xAxis = d3.axisBottom(xScale);


// Setup y
var yValue = function(d) { return d[1];},
	yScale = d3.scaleLinear().range([height, 0]),
	yMap = function(d) { return yScale(yValue(d)) ;},
	yAxis = d3.axisLeft(yScale);

// change string (from CSV) into number format
data.forEach(function(d) {
    /*d[0] = +d[0];
    d[1] = +d[1];*/
    console.log(d3.max(data,xValue))
    console.log(yMap(d));
 });

// 
xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);


// Create SVG element
var svg = d3.select("body")
			 .append("svg")
			 .attr("width", width + margin.left + margin.right)
			 .attr("height", height + margin.top + margin.bottom)
			.append("g")
			 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X-axis
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + margin.right + "," + height + ")")
	.call(xAxis)
   .append("text")
   .attr("class", "label")
   .attr("x", width)
   .attr("y", -6)
   .style("text-anchor", "end")
   .text("Teen pregnancies");

// Y axis
svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
   .append("text")
    .attr("class", "label")
    .attr("transform",  "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("GDP")

// Draw dots
svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", xMap)
	.attr("cy", yMap)
	.attr("r", 3.5);

}

Promise.all(requests).then(function(response) {


// Create data Object
var dataScatterplot = {
  dataGDP : transformResponseV2(response[2]),    	
  dataViolent : transformResponse(response[0]),
  dataPregnancies : transformResponse(response[1])
};
var years = ["2012","2013","2014","2015"]
	var keys = Object.keys(dataScatterplot);
	var selectedData = selectData(dataScatterplot, keys, years);
	var lst = createDataPointList(selectedData);
	createScatterplot(lst[1]);
	//console.log(selectedData["2012"][0].Australia.hasOwnProperty("datapointdataPregnancies"));

}).catch(function(e){
throw(e);
});