 var margin = {top: 10, right: 20, bottom: 20, left: 10};

    var height = fullheight - margin.top - margin.bottom;
    var width = fullwidth - margin.left - margin.right;

    var format = d3.format;


    var vis = d3.select("#chart40").append("svg");
    var svg = vis
        .attr("width", fullwidth)
        .attr("height", fullheight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		
		d3.csv("data/allData.csv", function(error, data) {
			
//			xScale.domain(
//				d3.extent(data, function(d) {
//					return +d.column;
//				}));
//			  yScale.domain(
//				d3.extent(data, function(d) {
//					return +d.province;
//				}));

        var column = d3.select("#menu select").property("value");
        var dataset = top20_by_column(data, column); 
        //setup our ui -- requires access to data variable, so inside csv
        d3.select("#menu select")
            .on("change", function() {
                column = d3.select("#menu select").property("value"); //TODO: How do you get the current value of the select menu?
                dataset = top20_by_column(data, column);//TODO: How do you get the current filter/storted data?
                //console.log(column, dataset);
                redraw(dataset, column);
        });

        redraw(dataset, column);

    });
//        var data1 = [
//            {country: "Belgium", value: 5}, // in data set 2
//            {country: "USA", value: 20}, // in data set 2
//            {country: "China", value: 55}, // in data set 2
//            {country: "Russia", value: 15},
//            {country: "France", value: 60}, // in data set 2
//            {country: "Chile", value: 89}
//        ];
//        var data2 = [
//            {country: "Belgium", value: 5, plus: 9}, // in data set 1
//            {country: "USA", value: 20, plus: 9}, // in data set 1
//            {country: "Spain", value: 35, plus: 9},
//            {country: "China", value: 55, plus: 9}, // in data set 1
//            {country: "UK", value: 90, plus: 9},
//            {country: "Brazil", value: 40, plus: 9},
//            {country: "France", value: 60, plus: 9}, // in data set 1
//            {country: "Canada", value: 39, plus: 9},
//            {country: "Argentina", value: 99, plus: 9}
//        ];
      
		
		function top20_by_column(data, column) {

      

       
        var newData = data.sort(function(a,b){return b[column] - a[column];})
                          .slice(1,20);

        return newData;
        }

    // update function

    function redraw(data, column) {

        var max = d3.max(data, function(d) {return +d[column];});

        xScale = d3.scaleLinear()
            .domain([0, max*1.05]) 
            .range([0, width]);

        yScale = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([0, height])
            .padding(.2);


        var bars = svg.selectAll("rect.bar")
            .data(data, function (d) { return d.province;}); 

        //update -- existing bars get blue when we "redraw". 
        bars
            .attr("fill", "#37474F");

        //enter - new bars get set to darkorange when we "redraw."
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", "#37474F")
            .merge(bars)
            .transition()
            .duration(300)
            .attr("width", function(d) {
                return xScale(+d[column]); 
            })
            .attr("height", yScale.bandwidth())
            .attr("transform", function(d,i) {
                return "translate(0," + yScale(i) + ")";
            });


        //exit -- remove ones that aren't in the index set
        bars.exit()
            .transition()
            .duration(300)
            .attr("width", 0)
            .remove();
          
        var labels = svg.selectAll("text.labels")
            .data(data, function (d) { return d.province;}); 

       
        labels.enter()
            .append("text")
            .attr("class", "labels")
            .merge(labels)
            .transition()
            .duration(400)
            .text(function(d) {
                return d.province + " " + format(+d[column])})
            .attr("transform", function(d,i) {
                return "translate(" + xScale(+d[column]) + "," + yScale(i) + ")"
            })
            .attr("dy", "1.2em")
            .attr("dx", "-3px")
            .attr("text-anchor", "end"); 

        labels.exit()
            .remove();

       
        }// end of draw function
		
		
//		var xAxis = d3.axisBottom(xScale).ticks(5)
//	              .tickFormat(function(d) {
//					  return d + "%";
//						});
//	var yAxis = d3.axisLeft(yScale).ticks(5)
//				  .tickFormat(function(d) {
//					  return d + "%";
//						});
//		svg.append("g")
//				.attr("class", "x axis")
//				.attr("transform", "translate(0," + fullHeight + ")")
//				.call(xAxis);
//			svg.append("g")
//				.attr("class", "y axis")
////		        .attr("transform", "translate(138,0)")
//				.call(yAxis);
//		});
	
		var tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip");
//		var radius=4;
	   bars  .on("mouseover", mouseoverFunc) 
                .on("mousemove", mousemoveFunc)
                .on("mouseout", mouseoutFunc); 
		function mouseoverFunc(d) {
            tooltip .style("display", null) 
                    .html("<p>" + d.province + "工读学校数量为 " + d.value + "</p>");

//             d3.select(this)
//                .attr("r", radius * 1.5);
//        }

        function mousemoveFunc(d) {
            tooltip
                .style("top", (d3.event.pageY - 10) + "px" )
                .style("left", (d3.event.pageX + 10) + "px");
        }


        }// JavaScript Document