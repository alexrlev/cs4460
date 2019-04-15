var svg = d3.select('svg'),
	width = +svg.attr("width"),
    height = +svg.attr("height");

//zoom stuff
var transform = d3.zoomIdentity;

// y scale is for the "Mean Earnings 8 years After Entry" 
var yScale = d3.scaleLinear()
	.range([500, 0]);


// x scale is the cost to attend 
var xScale = d3.scaleLinear()
	.range([0, 700]);

// get radius of the size of the school
var rScale = d3.scaleSqrt()
	.range([1,15]);

//on-hover tooltip
var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function(d) {
        return "<h5>"+d['Name']+"</h5><table><thead><tr><td>Average Tuition</td><td>Mean Earnings After 8 Years</td><td>ROI</td></thead>"
        	+ "<tbody><tr><td>$" + d['Average Cost'] + "</td><td>$" + d['Mean Earnings 8 years After Entry'] + "</td><td>$" + (d['Mean Earnings 8 years After Entry'] - d['Average Cost']) + "</td></tr></tbody>"
        	+ "<thead><tr><td>% White</td><td>% Black</td><td>% Hispanic</td></tr></thead>"
            + "<tbody><tr><td>"+formatPercent(d['% White'])+"</td><td>"+formatPercent(d['% Black'])+"</td><td>"+formatPercent(d['% Hispanic'])+"</td></tr></tbody>"
            + "<thead><tr><td>% Asian</td><td>% Native American</td><td>% Pacific Islander</td></tr></thead>"
            + "<tbody><tr><td>"+formatPercent(d['% Asian'])+"</td><td>"+formatPercent(d['% American Indian'])+"</td><td>"+formatPercent(d['% Pacific Islander'])+"</td></tr></tbody></table>"
    });

svg.call(tip);

//format decimal to percet
var formatPercent = d3.format(",.2%");

//load data into dataset 
d3.csv('./data/colleges.csv', function(error, dataset) {
	
	universities = dataset;

	var filterUniversity = d3.nest()
	  .key(function(d) { 
	  		if (d.Control == "Private") {
	  			return d;
	  		}; 
	  	})
	  .entries(dataset);

	var privateUniversity = filterUniversity[0].values;
	var publicUniversity = filterUniversity[1].values;

	// find the max compute the domain for variables
	var radiusMax = d3.max(universities, function(d){
		return +d['Undergrad Population'];
	});
	rScale.domain([0,radiusMax]);

	var tuition = d3.extent(universities, function(d){
		return + d['Average Cost'];
	});
	xScale.domain(tuition);

	var earnings = d3.extent(universities, function(d){
		return + d['Mean Earnings 8 years After Entry'];
	});
	yScale.domain(earnings);

	//creating public university squares
	var publicObj = svg.selectAll('.Name')
		.data(publicUniversity)
		.enter()
		.append('circle')
		.attr('class', 'circle')
		.attr('r', function(d){ //encode population to size
			return rScale(d['Undergrad Population']);
		})
		.attr('cx', function(d){
			return xScale(d['Average Cost']);
		})
		.attr('cy', function(d){
			return yScale(d['Mean Earnings 8 years After Entry'])
		})
		.attr('transform', 'translate(100, 60)')
		.style('fill', function(d){
			if (d.Region == "Far West") return 'khaki';
			if (d.Region == "Great Lakes") return 'orange';
			if (d.Region == "Great Plains") return 'rosybrown';
			if (d.Region == "New England") return 'hotpink';
			if (d.Region == "Mid-Atlantic") return 'blueviolet';
			if (d.Region == "Outlying Areas") return 'lightskyblue';
			if (d.Region == "Rocky Mountains") return 'teal';
			if (d.Region == "Southeast") return 'lightgreen';
			if (d.Region == "Southwest") return 'lightslategray';
		})
	    .attr('fill-opacity', 0.8);

	//show tooltip on hover
	publicObj.on('mouseover', tip.show)
    	.on('mouseout', tip.hide);

    //creating private university dots
	var privateObj = svg.selectAll('.Name')
		.data(privateUniversity)
		.enter()
		.append('rect')
		.attr('class', 'circle')
		.attr('width', function(d){ //encode population to size
			return rScale(d['Undergrad Population']*2);
		})
		.attr('height', function(d){
			return rScale(d['Undergrad Population']*2);
		})
		.attr('x', function(d){
			return xScale(d['Average Cost']);
		})
		.attr('y', function(d){
			return yScale(d['Mean Earnings 8 years After Entry'])
		})
		.attr('transform', 'translate(100,50)')
		.style('fill', function(d){
			if (d.Region == "Far West") return 'khaki';
			if (d.Region == "Great Lakes") return 'orange';
			if (d.Region == "Great Plains") return 'rosybrown';
			if (d.Region == "New England") return 'hotpink';
			if (d.Region == "Mid-Atlantic") return 'blueviolet';
			if (d.Region == "Outlying Areas") return 'lightskyblue';
			if (d.Region == "Rocky Mountains") return 'teal';
			if (d.Region == "Southeast") return 'lightgreen';
			if (d.Region == "Southwest") return 'lightslategray';
		})
	    .attr('fill-opacity', 0.8);

	//show tooltip on hover
	privateObj.on('mouseover', tip.show)
    	.on('mouseout', tip.hide);

    // x-axis label
	var xLine = svg.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(100,560)')
	    .call(d3.axisBottom(xScale));

	// y-axis label
	var yLine = svg.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(100,60)')
		.call(d3.axisLeft(yScale));

	//zooming and dragging graph
	svg.call(d3.zoom()
    	.scaleExtent([1 / 2, 8])
    	.translateExtent([[-100, -100], [width + 90, height + 100]])
    	.on("zoom", zoomed));

	function zoomed() {
		publicObj.attr("transform", d3.event.transform);
		privateObj.attr("transform", d3.event.transform);

		xLine.attr("transform", d3.event.transform);
		yLine.attr("transform", d3.event.transform);
	}

	function dragged(d) {	
	  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
	  d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
	}

});

var xLabelText = svg.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate(350,590)')
        .text('Average Tuition in USD ($)');

var yLabelText = svg.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'translate(50,400) rotate(270)')
        .text('Mean Earnings 8 years After Entry');

//filter by region
var data = ["Far West", "Great Lakes", "Great Plains", "New England", "Mid-Atlantic", "Outlying Areas", "Rocky Mountains", "Southeast", "Southwest"];

var select = d3.select('body')
	.append('select')
	.style("margin-left", "10px")
    .on('change', onchange);

var options = select
  	.selectAll('option')
	.data(data).enter()
	.append('option')
	.text(function (d) { return d; });

function onchange() {
	selectValue = d3.select("select").property("value");
	console.log("selectValue: " + selectValue);
	svg.selectAll('.circle')
		.transition()
        .duration(function(d) {
        	return Math.random() * 1000;
        })
        .style('fill', function(d) {
        	if (d.Region == selectValue) {
        		if (d.Region == "Far West") return 'khaki';
				if (d.Region == "Great Lakes") return 'orange';
				if (d.Region == "Great Plains") return 'rosybrown';
				if (d.Region == "New England") return 'hotpink';
				if (d.Region == "Mid-Atlantic") return 'blueviolet';
				if (d.Region == "Outlying Areas") return 'lightskyblue';
				if (d.Region == "Rocky Mountains") return 'teal';
				if (d.Region == "Southeast") return 'lightgreen';
				if (d.Region == "Southwest") return 'lightslategray';
			} else
				return 'rgba(255,255,255,0)';
        })
	    .attr('fill-opacity', .8);
};

d3.select('body')
        .append('button')
        .style("border", "1px solid black")
        .style("margin-left", "10px")
        .text('Reset Filter')
        .on('click', function() {
            svg.selectAll('.circle')
                .transition()
                .duration(function(d) {
                    return Math.random() * 1000;
                })
                .style('fill', function(d) {
					if (d.Region == "Far West") return 'khaki';
					if (d.Region == "Great Lakes") return 'orange';
					if (d.Region == "Great Plains") return 'rosybrown';
					if (d.Region == "New England") return 'hotpink';
					if (d.Region == "Mid-Atlantic") return 'blueviolet';
					if (d.Region == "Outlying Areas") return 'lightskyblue';
					if (d.Region == "Rocky Mountains") return 'teal';
					if (d.Region == "Southeast") return 'lightgreen';
					if (d.Region == "Southwest") return 'lightslategray';
				})
                .attr('fill-opacity', .8);
        });