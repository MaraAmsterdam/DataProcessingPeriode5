window.onload = function() {


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

		// Setup x scales
		var xScale = d3.scaleBand()
					.rangeRound([0, width])
					.paddingInner(0.1)
					.domain(data.map(function(d){ return d.workoutfreq; }));

		var xScale1 = d3.scaleBand()
					.padding(0.05)
					.domain(data.map(function(d){ return d.health; }))
		   			.rangeRound([0, xScale.bandwidth()])
		   			.padding(0.2);

		var y = d3.scaleLinear()
				   .rangeRound([height, 0]);

		var z = d3.scaleOrdinal()
				   .range(["#fdae6b","#fee6ce","#e6550d"])
				   .domain(data.map(function(d){ return d.happiness; }));
		var keys = z.domain();


		var stack = d3.stack()
		     		   .offset(d3.stackOffsetExpand);


		var groupedData = d3.nest()
							 .key(function(d) { return d.health + d.workoutfreq; })
							 .rollup(function(d,i){

								var d2 = {health: d[0].health, workoutfreq: d[0].workoutfreq}
								d.forEach(function(d){
									d2[d.happiness] = d.value;
								})
					    		return d2;			
							 })
							 .entries(data)
							 .map(function(d){ return d.value; });

		console.log(groupedData);
		var stackData = stack.keys(keys)(groupedData);
		//console.log(stackData);

		var tip = d3.tip()
					 .attr("class", "d3-tip")
					 .offset([-10,0])
					 .html(function(d, i) {
					var thisName = d3.select(this.parentNode).datum().key,
						thisValue = d.data[thisName],
						total = d.data.happy + d.data.neutral + d.data.unhappy,
						proportion =  (thisValue / total).toFixed(2) ;

					return (thisValue + "% of the people who work out " + d.data.workoutfreq + "<br>" + "are " + thisName  +" about their " +  d.data.health + " health");
					//return (thisName + " about " + d.data.health + " health" +"<br>"+ "workout freq: " + d.data.workoutfreq+"<br>"+proportion);	
					//return "<strong>Happiness:</strong> <span>" + thisName + "</span>";
					});

		svg.call(tip);


		var serie = svg.selectAll(".serie")
					  .data(stackData)
					  .enter()
					  .append("g")
					   .attr("class", "serie")
					   .attr("fill", function(d){ return z(d.key); });


		serie.selectAll("rect")
		      .data(function(d) { console.log(d);return d; })
		      .enter()
		      .append("rect")
		        .attr("class", "serie-rect")
				.attr("transform", function(d, i) { return "translate(" + xScale(d.data.workoutfreq) + ",0)"; })
				.attr("x", function(d) { return xScale1(d.data.health); })
				.attr("y", function(d) { return y(d[1]); })
				.attr("height", function(d) { return y(d[0]) - y(d[1]); })
				.attr("width", xScale1.bandwidth())
				.on("mouseover", tip.show)
				.on("mouseout", tip.hide); 

		svg.append("g")
		  .attr("class", "axis x")
		  .attr("transform", "translate(0," + height + ")")
		  .call(d3.axisBottom(xScale))
		  .append("text")
		   .attr("x", 200)
		   .attr("y", 0)
		   .attr("dy", "0.32em")
		   .attr("text-anchor", "end")
		   .text("Workout frequency");

		svg.append("g")
		  .attr("class", "axis y")
		  .call(d3.axisLeft(y).ticks(10))
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


	});
};