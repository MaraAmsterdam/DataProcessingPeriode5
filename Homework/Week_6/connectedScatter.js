// Function to create new SVG and Multiple line chart

function connectedScatter(filepath){

	d3.json(filepath).then(function(data){

		var margin = {top : 40, bottom : 60, left : 60, right: 100},
		width = 900 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

		var groups = [data[0].frequency, data[1].frequency, data[2].frequency];

		var svg = d3.select("#connectedScatter")
					 .append("svg")
						.attr("width", width + margin.left + margin.right)
					 	.attr("height", height + margin.top + margin.bottom)
					 .append("g")
					 	.attr("tranform", "translate(" + margin.left + "," + margin.top +")");

		var colorScale = d3.scaleOrdinal()
						 	.domain(groups)
						 	.range(["#fee6ce","#fdae6b","#e6550d"]);
		var xScale = d3.scaleLinear()
						.domain([2014,2017])
						.rangeRound([margin.left, width]);

		/*var xScale = d3.scaleTime()
				.domain([new Date(2014,0,1), new Date(2024,0,1)])
				.range([0,10]);	*/

		svg.append("g")
			.attr("transform", "translate(0," + (height + margin.top) + ")")
			.call(d3.axisBottom(xScale)
					.ticks(4));



		var yScale = d3.scaleLinear()
						.domain([0, 100])
						.range([height, 0]);

		svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(d3.axisLeft(yScale))

		svg.append("text")
			.attr("class", "titlegraph")
	        .attr("x", (width / 2))             
	        .attr("y", (margin.top/2))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Percentage of people in (non)compliance with the Dutch fit-norm");

		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 30)
			.attr("x", 300)
			.attr("dy", "1em")
			.style("text-anchor", "start")
			.text("Value"); 

		// Add lines
		var line = d3.line()
					  .x(function(d) { console.log(xScale(+d.year)); return xScale(+d.year); })
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

		//Initiate tooltip
		var tooltip = d3.select("#tipContainer").append("div")
		  .attr("class", "tooltip")
		  .style("opacity", 0);

		// tooltip mouseover event handler
		var tipShow = function(d) {
		  var html  = d.year + "<br/>" + d.value + "%";

		  tooltip.html(html)
		      .style("left", (d3.event.pageX + 15) + "px")
		      .style("top", (d3.event.pageY - 28) + "px")
		    .transition()
		      .duration(200) // ms
		      .style("opacity", .9) // started as 0!

		};
		// tooltip mouseout event handler
		var tipHide = function(d) {
		  tooltip.transition()
		      .duration(300) // ms
		      .style("opacity", 0); // don't care about position!
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


	});
};


function changeOpacity(workoutfreq){
	/*
	Function to show and hide lines
	*/ 
	//
	currentOpacity = d3.selectAll("." + workoutfreq).style("opacity")
	d3.selectAll("." + workoutfreq).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

	currentOpacityDots = d3.selectAll("." + workoutfreq).selectAll("circle").style("opacity")
	d3.selectAll("." + workoutfreq).selectAll("circle").transition().style("opacity", currentOpacity == 1 ? 0 : 1)
};

