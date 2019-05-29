/*
Author: Mara Oosyterbaan
Function to create new SVG and Multiple line chart
*/

function connectedScatter(filepath, workoutfreq){

	d3.json(filepath).then(function(data){

		var margin = {top : 40, bottom : 60, left : 60, right: 100},
			width = 900 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom,
			groups = [data[0].frequency, data[1].frequency, data[2].frequency];

		var svg = d3.select("#connectedScatter")
					 .append("svg")
						.attr("width", width + margin.left + margin.right)
					 	.attr("height", height + margin.top + margin.bottom)
					 .append("g")
					 	.attr("tranform", "translate(" + margin.left + "," + margin.top +")");

		// Create color scale
		var colorScale = d3.scaleOrdinal()
						 	.domain(groups)
						 	.range(["#feb24c","#fd8d3c","#e31a1c"]);

		// Create x-scale and axis
		var xScale = d3.scaleLinear()
						.domain([2014,2017])
						.rangeRound([margin.left, width]);
		svg.append("g")
			.attr("transform", "translate(0," + (height + margin.top) + ")")
			.call(d3.axisBottom(xScale)
					.ticks(4)
					.tickFormat(function(d){
						return Number(d);
					}));
		setTitle(svg, (width/2), 380, 0, "Time in years", 13);


		// Create y-scale and axis
		var yScale = d3.scaleLinear()
						.domain([0, 100])
						.range([height, 0]);
		svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(d3.axisLeft(yScale))
		setTitle(svg, -200, 20, -90, "Percentage of people", 13);


		// Set graph title
		setTitle(svg, (width / 2), (margin.top/2), 0, "Percentage of people in (non)compliance with the Dutch fit-norm", 16);
		

		// Add lines
		var line = d3.line()
					  .x(function(d) { return xScale(+d.year); })
					  .y(function (d) { return yScale(+d.value); })
		svg.selectAll("lines")
			.data(data)
			.enter()
			.append("path")
				.attr("class", function(d){ return d.frequency; })
				.attr("d", function(d){ return line(d.values); })
				.attr("stroke", function(d){ return colorScale(d.frequency); })
				.style("stroke-width", 4)
				.style("fill", "none")
				.style("opacity", 0);

		// Initiate tooltip
		var tooltip = d3.select("#tipContainer").append("div")
		  .attr("class", "tooltip")
		  .style("opacity", 0);


		var tipShow = function(d) {
		  var html  = "In " + d.year + " "+ d.value + "% of" + "<br/>" + "this group worked out";

		  tooltip.html(html)
		      .style("left", (d3.event.pageX + 15) + "px")
		      .style("top", (d3.event.pageY - 28) + "px")
		    .transition()
		      .duration(200)
		      .style("opacity", .9) 

		};

		var tipHide = function(d) {
		  tooltip.transition()
		      .duration(300) 
		      .style("opacity", 0);
		}; 


		// Add dots
		svg.selectAll("dots")
			.data(data)
			.enter()
				.append("g")
				.style("fill", function(d){ return colorScale(d.frequency); })
				.attr("class", function(d){ return d.frequency; })
			.selectAll("points")
			.data(function(d){ return d.values })
			.enter()
			.append("circle")
				.attr("cx", function(d){ return xScale(d.year); })
				.attr("cy", function(d){ return yScale(d.value)})
				.attr("r", 5)
				.attr("stroke", "white")
				.style("opacity", 0)
				.on("mouseover", tipShow)
                .on("mouseout", tipHide);

		// Add line labels 
		svg.selectAll("labels")
		   .data(data)
		   .enter()
		   .append("g")
		   .append("text")
		   		.attr("class", function(d){ return d.frequency; })
		   		.datum(function(d){ return {frequency : d.frequency, value : d.values[d.values.length - 1]}; })
		   		.attr("transform", function(d){ return "translate(" + xScale(d.value.year) + "," + yScale(d.value.value) + ")"; })
		   		.attr("x", 12)
		   		.text(function(d){ return d.frequency; })
		   		.style("fill", function(d){ return colorScale(d.frequency); })
		   		.style("font-size", 15)
		   		.style("opacity", 0);

		// Make line visible
		changeOpacity(workoutfreq);
	});

};

function setTitle(svg, x,y,rotation, title, textSize){
/*
Function to add text to graph
*/

	svg.append("text")
		.attr("class", "titlegraph")
		.attr("transform", "rotate("+ rotation + ")")
		.attr("x", x)             
		.attr("y", y)
		.attr("text-anchor", "middle")  
		.style("font-size", textSize + "px") 
		.text(title);

};

function changeOpacity(workoutfreq){
/*
Function to show and hide lines
*/ 
	currentOpacity = d3.selectAll("." + workoutfreq).style("opacity")
	d3.selectAll("." + workoutfreq).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

	currentOpacityDots = d3.selectAll("." + workoutfreq).selectAll("circle").style("opacity")
	d3.selectAll("." + workoutfreq).selectAll("circle").transition().style("opacity", currentOpacity == 1 ? 0 : 1)
};

