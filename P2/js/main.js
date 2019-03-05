// **** Your JavaScript code goes here ****
//NOTE: this is the D3 v4 loading syntax. For more details, see https://piazza.com/class/jnzgy0ktwi34lk?cid=75.

console.clear();

var margin = {top: 20, right: 20, bottom: 20, left: 20};
	width = 370 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

d3.csv("./data/coffee_data.csv", function(data) {
	data.forEach(function(d) {
		d.sales = +d.sales;
	});
	plotByRegion(data);
	plotByProduct(data);
});

//set up fill color palettes
var colorScale1 = d3.scaleOrdinal()
	.domain([0, 1, 2, 3])
	.range(['#A5D8DD', '#EA6A47', '#DBAE58', '#D32D41']);
console.log('color scale range', colorScale1.range());
var colorScale2 = d3.scaleOrdinal()
	.domain([0, 1, 2, 3])
	.range(['#0091D5', '#6AB187', '#EFC635', '#E27560']);
console.log('color scale range', colorScale2.range());

//text to float by mouse
var tooltip = d3.select("body")
    .append("div")
   	.style("position", "absolute")
   	.style("z-index", "10")
   	.style("visibility", "hidden")
   	.style("background", "rgba(255, 255, 255, .8)")
   	.style("padding", "5px")
   	.style("border", "1px solid black")
    .style("border-radius", "5px")
    .text("$");

//making text hover functions
function handleMouseOver(d) {
	d3.select(this).style("opacity", ".3");
	tooltip.text("$" + d.value);
	return tooltip.style("visibility", "visible");
}
function handleMouseMove() {
	return tooltip.style("top", (d3.event.pageY-10)+"px")
        		.style("left",(d3.event.pageX+10)+"px");
}
function handleMouseOut() {
	d3.select(this).style("opacity", "1");
	return tooltip.style("visibility", "hidden");
}

//~~~~~~~~~~~~~~~~~~~~Plot By Region~~~~~~~~~~~~~~~~~~~~

var region_svg = d3.select('#svgGraph').append('g')
	.attr('width', 370)
	.attr('height', 600);

function plotByRegion(rawData) {
	const coffeeByRegion = d3.nest()
		.key(function(d) { return d.region; })
		.rollup(function(v) {return d3.sum(v, function(d) { return +d.sales; }); })
		.entries(rawData);

	console.log(coffeeByRegion);

	//size x-axis ticks
	var xScale = d3.scaleOrdinal()
		.domain(coffeeByRegion.map(d => d.key))
		.range([width/4, width/2, 3*width/4, width]);

	//size y-axis ticks
	var yScale = d3.scaleLinear()
		.domain([0, d3.max(coffeeByRegion.map(d => d.value)) + 1])
		.range([height, 50]);

	//chart title
	region_svg.append("text")
		.attr("x", width/2 + 50)
		.attr("y", 35)
		.style("text-anchor", "middle")
		.style("font-size", 16)
		.style("text-decoration", "bold")
		.text("Coffee Sales by Region (USD)");

	//x-axis
	var xAxis = d3.axisBottom().scale(xScale);
	region_svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(15, " + height + ")")
		  .call(xAxis);

	//x-axis label
	region_svg.append("text")
		.attr("class", "label")
		.attr("transform", "translate(" + (width/2 + 40) + ", " + (height + 33) + ")")
		.style("text-anchor", "middle")
		.text("Region");

	//y-axis, 5 tick marks, 250k format
	var yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(d3.format("$.2s"));
	region_svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(60)")
		.call(yAxis);

	//y axis label
	region_svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Coffee Sales (USD)");

	//bars
	region_svg.selectAll(".bar")
		.data(coffeeByRegion)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", d => xScale(d.key))
		.attr("y", d => yScale(d.value))
		.attr("height", d => height - yScale(d.value))
		.attr("width", 40)
		.style("fill", d => colorScale1(d.key))
		.on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseout", handleMouseOut);
}

//~~~~~~~~~~~~~~~~~~~~Plot By Product~~~~~~~~~~~~~~~~~~~~

var product_svg = d3.select('#svgGraph').append('g')
	.attr('width', 370)
	.attr('height', 600)
	.attr("transform", "translate(375, 0)");

function plotByProduct(rawData) {
	const coffeeByProduct = d3.nest()
		.key(function(d) { return d.category; })
		.rollup(function(v) {return d3.sum(v, function(d) { return d.sales; }); })
		.entries(rawData);
	
	//make common scale to sales by region
	const commonScale = d3.nest()
		.key(function(d) { return d.region; })
		.rollup(function(v) {return d3.sum(v, function(d) { return d.sales; }); })
		.entries(rawData);

	console.log(coffeeByProduct);

	var xScale = d3.scaleOrdinal()
		.domain(coffeeByProduct.map(d => d.key))
		.range([width/4, width/2, 3*width/4, width], 1);

	var yScale = d3.scaleLinear()
		.domain([0, d3.max(commonScale.map(d => d.value)) + 1])
		.range([height, 50]);

	//chart title
	product_svg.append("text")
		.attr("x", width/2 + 50)
		.attr("y", 35)
		.style("text-anchor", "middle")
		.style("font-size", 16)
		.style("text-decoration", "bold")
		.text("Coffee Sales by Product (USD)");

	//x-axis
	var xAxis = d3.axisBottom().scale(xScale);
	product_svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(15, " + height + ")")
		  .call(xAxis);
	
	//x-axis label	
	product_svg.append("text")
		  .attr("class", "label")
		  .attr("transform", "translate(" + (width/2 + 40) + ", " + (height + 33) + ")")
		  .style("text-anchor", "middle")
		  .text("Product");

	//y-axis, 5 tick marks, 250k format
	var yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(d3.format("$.2s"));;
	product_svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(60, 0)")
		.call(yAxis);

	//y axis label
	product_svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Coffee Sales (USD)");

	//bars
	product_svg.selectAll(".bar")
		.data(coffeeByProduct)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("x", d => xScale(d.key))
		.attr("y", d => yScale(d.value))
		.attr("height", d => height - yScale(d.value))
		.attr("width", 40)
		.style("fill", d => colorScale2(d.key))
		.on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseout", handleMouseOut)
}

