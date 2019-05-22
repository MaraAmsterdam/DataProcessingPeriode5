

d3.json("data/workout_2016.json").then(function(data){

	var margin = {top : 40, bottom : 60, left : 60, right: 100},
		height = 500 - margin.bottom - margin.top,
		width = 900 - margin.left - margin.right;

	var svg = d3.select("body")
				  .append("svg")
				  .attr("width", width + margin.left + margin.right)
				  .attr("height", height + margin.top + margin.bottom)
				.append("g")
				  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Setup x 
	var x0 = d3.scaleBand()
				.rangeRound([0, width])
				.paddingInner(0.1);

	var x1 = d3.scaleBand()
				.padding(0.05);

	var y = d3.scaleLinear()
			   .rangeRound([height, 0])

	var y1 = d3.scaleBand()

	var z = d3.scaleOrdinal()
			   .range(["#e34a33","#fdbb84", "#fee8c8"]);

	var stack = d3.stack()
	     .offset(d3.stackOffsetExpand);

	x0.domain(data.map(function(d){ return d.workoutfreq; }));
	x1.domain(data.map(function(d){ return d.health; }))
	   .rangeRound([0, x0.bandwidth()])
	   .padding(0.2);

	z.domain(data.map(function(d){ return d.happiness; }));
	var keys = z.domain();

	var groupedData = d3.nest()
						 .key(function(d) { return d.health + d.workoutfreq; })
						 .rollup(function(d,i){

							var d2 = {health: d[0].health, workoutfreq: d[0].workoutfreq}
							d.forEach(function(d){
								d2[d.happiness] = d.value
							})
				      		console.log("rollup d", d, d2);
				    		return d2;			
						 })
						 .entries(data)
						 .map(function(d){ return d.value; });


	var stackData = stack.keys(keys)(groupedData);

	var serie = svg.selectAll(".serie")
				  .data(stackData)
				  .enter()
				  .append("g")
				   .attr("class", "serie")
				   .attr("fill", function(d){ return z(d.key); });


	serie.selectAll("rect")
	      .data(function(d) { 
	      	console.log(d);
	      	return d; })
	      .enter()
	      .append("rect")
	        .attr("class", "serie-rect")
			.attr("transform", function(d, i) { return "translate(" + x0(d.data.workoutfreq) + ",0)"; })
			.attr("x", function(d) { return x1(d.data.health); })
			.attr("y", function(d) { return y(d[1]); })
			.attr("height", function(d) { return y(d[0]) - y(d[1]); })
			.attr("width", x1.bandwidth())
			.on("click", function(d, i){ console.log("serie-rect click d", i, d); });

	svg.append("g")
	  .attr("class", "axis x")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x0));

	svg.append("g")
	  .attr("class", "axis y")
	  .call(d3.axisLeft(y).ticks(null, "s"))
	 .append("text")
	  .attr("x", 2)
	  .attr("y", y(y.ticks().pop()) + 0.5)
	  .attr("dy", "0.32em")
	  .attr("fill", "#000")
	  .attr("font-weight", "bold")
	  .attr("text-anchor", "start")
	  .text("Health Satisfaction");

	  var legend = svg.append("g")
	      .attr("font-family", "sans-serif")
	      .attr("font-size", 10)
	      .attr("text-anchor", "end")
	    .selectAll("g")
	    .data(keys.slice().reverse())
	    .enter().append("g")
	      .attr("transform", function(d, i) { return "translate(50," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width)
	      .attr("width", 19)
	      .attr("height", 19)
	      .attr("fill", z);

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9.5)
	      .attr("dy", "0.32em")
	      .text(function(d) { return d; });
		/*
	var legend = svg.append("g")
					 .data(stackData)
					 .attr("class", "legend")
					 .attr("transform", function(d) { 
					 	console.log(d);
					 	var d = d[d.length - 1]; 
					 	return "translate(" +
					 	(x0(d.data.workoutfreq) +
					 	x1(d.data.health) + 
					 	x1.bandwidth()) + "," +
					 	((y(d[0]) + 
					 	y(d[1])) / 2) + ")"});

	legend.append("line")
			.attr("x1", -6)
			.attr("x2", 6)
			.attr("stroke", "#000");

	legend.append("text")
			.attr("x", 9)
			.attr("dy", "0.35em")
			.attr("fill", "#000")
			.style("font", "10px sans-serif")
			.text(function(d){ return d.key; });*/

});