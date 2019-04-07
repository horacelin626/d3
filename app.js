var svg_width = 960;
var svg_height = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 80,
	left: 100
}

var width = svg_width - margin.left - margin.right
var height = svg_height - margin.top - margin.bottom
	
// Chart Params

// SVG wrapper, and shift the latter by left and top margins.
var svg = d3.select(".scatter")
		    .append("svg")
			.attr("width",svg_width)
			.attr("height",svg_height)

// Appending an SVG group that will hold our chart
var svgGroup = svg.append("g")
			      .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing data from the external CSV file
d3.csv("data.csv", function(err, census_data) {
	if (err) throw err;
	// Format the data
	census_data.forEach(function(data) {
		data.abbr = data.abbr
		data.poverty = +data.poverty
		data.povertyMoe = +data.povertyMoe
		data.age = +data.age
		data.ageMoe = +data.ageMoe
		data.income = +data.income
		data.incomeMoe = +data.incomeMoe
		data.healthcare = +data.healthcare;
		data.healthcareLow = +data.healthcareLow
		data.healthcareHigh = +data.healthcareHigh
		data.obesity = +data.obesity
		data.obesityLow = +data.obesityLow
		data.obesityHigh = +data.obesityHigh
		data.smokes = +data.smokes
		data.smokesLow = +data.smokesLow
		data.smokesHigh = +data.smokesHigh
	})
	console.log(census_data)
	console.log(data['poverty'])
	
	// Scaling functions
	var xScale = d3.scaleLinear()
				   .domain([d3.min(census_data, d => d.poverty)-2,d3.max(census_data, d => d.poverty)+2])
				   .range([0, width])
	
	var yScale = d3.scaleLinear()
				   .domain([d3.min(census_data, d => d.healthcare)-2, d3.max(census_data, d => d.healthcare)+2])
				   .range([height,0])
	// Axis functions
	var bottom_axis = d3.axisBottom(xScale)
	var left_axis = d3.axisLeft(yScale)
	
	// Append Axes to the chart
	svgGroup.append('g')
		    .attr("transform", `translate(0,${height})`)
			.call(bottom_axis)
			
	svgGroup.append('g')
		    .call(left_axis)
	
	// Circle generators
	var circles = svgGroup.selectAll("circle")
						  .data(census_data)
						  .enter()
							.append("circle")
							.classed("stateCircle",true)
						  .attr("cx", d => xScale(d.poverty))
						  .attr("cy", d => yScale(d.healthcare))
						  .attr('r','15')
						  .attr("opacity", ".9")
	
	// Text generators
	var text = svgGroup.selectAll("text1")
						   .data(census_data)
						   .enter()
							 .append("text")
							 .classed("stateText",true)
						   .attr("x", d => xScale(d.poverty))
			               .attr("y", d => yScale(d.healthcare))
			               .text(d => d.abbr)
				
	// ToolTip
	var tool_tip = d3.tip()
					 .attr("class","d3-tip")
					 .offset([80, -60])
					 .html(function(data) {
						 return (`${data.state}<br>Poverty:${data.poverty}%<br>Lacks Healthcare:${data.healthcare}%`)
					 })
	
	// Create tooltip in the chart
	svgGroup.call(tool_tip)
	
	// Create event listeners to display and hide the tooltip
	circles.on("click", function(data) {
			tool_tip.show(data,this)
			 })
	text.on("click", function(data) {
				tool_tip.show(data,this)
				 })
	circles.on('mouseout', function(data){
		   tool_tip.hide(data)
		   })
	//Create axes labels
    svgGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)")

    svgGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("In Poverty (%)")