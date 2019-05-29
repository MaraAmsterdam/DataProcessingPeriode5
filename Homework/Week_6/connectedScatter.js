// Function calls new svg and second graph

function connectedScatter(filepath){

	d3.json(filepath).then(function(data){

		console.log(data)


		var margin = {top: 10, right: 100, bottom: 30, left: 30},
		width = 500 - margin.left - margin.right,
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
						.domain([0,4])
						.range([0, width]);					
		svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + height + ")")
			.call(d3.axisBottom(xScale));

		var yScale = d3.scaleLinear()
					.domain([0, 100])
					.range([height, 0]);

		svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(d3.axisLeft(yScale));

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
				.style("fill", "none");

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
				.attr("stroke", "white");

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
		   		.style("font-size", 15);

		svg.selectAll("legend")
			.data(data)
			.enter()
			.append("g")
			.append("text")
				.attr("x", function(d,i){ return 50 + (i * 80); })
				.attr("y", 30)
				.text(function(d){ return d.frequency; })
				.style("fill", function(d){ return colorScale(d.frequency); })
				.style("font-size", 15)
			.on("click", function(d){
				currentOpacity = d3.selectAll("." + d.frequency).style("opacity")
				d3.selectAll("." + d.frequency).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
			});







	});


}

