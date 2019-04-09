var width =500;
var height= 500;

d3.csv("calvinCollegeSeniorScores.csv", function(csv) {
    for (var i=0; i<csv.length; ++i) {
		csv[i].GPA = Number(csv[i].GPA);
		csv[i].SATM = Number(csv[i].SATM);
		csv[i].SATV = Number(csv[i].SATV);
		csv[i].ACT = Number(csv[i].ACT);
		csv[i].id = i;
    }
    var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });    
    
    var satExtents = {
		"SATM": satmExtent,
		"SATV": satvExtent
    }; 


    // Axis setup
    var xScale = d3.scaleLinear().domain(satmExtent).range([50, 470]);
    var yScale = d3.scaleLinear().domain(satvExtent).range([470, 30]);
 
    var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);
     
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
  
    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    //Create SVGs for charts
    var chart1 = d3.select("#chart1")
	    .append("svg:svg")
	    .attr("width",width)
	    .attr("height",height);

    var chart2 = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height);

    //chart 1 brushing chart 2
    var brush = d3.brush()
    	.extent([[-10, -10], [width + 10, height + 10]]); 
    brush.on('start', handleBrushStart)
      	.on('brush', handleBrushMove1)
      	.on('end', handleBrushEnd);
    var brushContainer1 = chart1.append('g')
        .attr('id', 'brush-container');
   	brushContainer1.call(brush);
  	function handleBrushMove1() {
	  	var sel = d3.event.selection;
	  	if (!sel) { 
	    	return;
	  	}
	  	var [[left, top], [right, bottom]] = sel;
	  	chart2.selectAll("circle")
	    	.classed("selected", function(d) {
	      		var cx = xScale(d['SATM']);
	      		var cy = yScale(d['SATV']);
	      		return left <= cx && cx <= right && top <= cy && cy <= bottom;
	    	});
	}

	/******************************************/
	//common brushing functions
	function handleBrushStart() {
    	clearSelected();
	}
	function handleBrushEnd() {
  		if (!d3.event.selection) {
    		clearSelected();
  		}
	}
	function clearSelected() {
  		d3.selectAll("circle").classed('selected', false);
  		d3.selectAll("circle").classed('selected2', false);
	}
	//chart 2 brushing chart 1
	var brush2 = d3.brush()
    	.extent([[-10, -10], [width + 10, height + 10]]); 
    brush2.on('start', handleBrushStart)
      	.on('brush', handleBrushMove2)
      	.on('end', handleBrushEnd);
	var brushContainer2 = chart2.append('g')
        .attr('id', 'brush-container');
   	brushContainer2.call(brush2);
  	function handleBrushMove2() {
	  	var sel = d3.event.selection;
	  	if (!sel) { 
	    	return;
	  	}
	  	var [[left, top], [right, bottom]] = sel;
	  	chart1.selectAll("circle")
	    	.classed("selected2", function(d) {
	      		var cx = xScale2(d['ACT']);
	      		var cy = yScale2(d['GPA']);
	      		return left <= cx && cx <= right && top <= cy && cy <= bottom;
	    	});
	}	 
	/******************************************/
	//add scatterplot points
    chart1.selectAll("circle") //var temp1 = 
	   	.data(csv)
	   	.enter()
	   	.append("circle")
	   	.attr("id",function(d,i) {return "circle-" + d.id;} )
	   	.attr("stroke", "black")
	   	.attr("cx", function(d) { return xScale(d.SATM); })
	   	.attr("cy", function(d) { return yScale(d.SATV); })
	   	.attr("r", 5)
		.on("click", function(d) {
	   		d3.select("#satm")
	   			.text(d.SATM);
	   		d3.select("#satv")
	   			.text(d.SATV);
	   		d3.select("#act")
	   			.text(d.ACT);
	   		d3.select("#gpa")
	   			.text(d.GPA);
	   		chart2.selectAll("circle")
	   			.classed("selected", function(d2) {
	   				return d == d2;
	   			});
	   	});

  	chart2.selectAll("circle") // var temp2 = 
		.data(csv)
	   	.enter()
	   	.append("circle")
	   	.attr("id",function(d,i) {return "circle-" + d.id;} )
	   	.attr("stroke", "black")
	   	.attr("cx", function(d) { return xScale2(d.ACT); })
	   	.attr("cy", function(d) { return yScale2(d.GPA); })
	   	.attr("r", 5)
	   	.on("click", function(d) {
	   		d3.select("#satm")
	   			.text(d.SATM);
	   		d3.select("#satv")
	   			.text(d.SATV);
	   		d3.select("#act")
	   			.text(d.ACT);
	   		d3.select("#gpa")
	   			.text(d.GPA);
	   		chart1.selectAll("circle")
	   			.classed("selected2", function(d2) {
	   				return d == d2;
	   			});
	   	});

    chart1 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis) // call the axis generator
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("SATM")
		.style("fill", "black");

    chart1 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("SATV")
		.style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis2)
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("ACT")
		.style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis2)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("GPA")
		.style("fill", "black");
	});