var fullwidth = 800,
            fullheight = 450;

        var margin = {top: 30, right: 150, bottom: 30, left: 60},
            width = fullwidth - margin.left - margin.right,
            height = fullheight - margin.top - margin.bottom;

        var svg = d3.select("#chart").append("svg")
                .attr("width", fullwidth )
                .attr("height", fullheight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xScale = d3.scaleBand()
                .range([0, width])
                .padding(.5);

        var yScale = d3.scaleLinear()
                .range([height, 0]);

        var colorScale = d3.scaleOrdinal().domain(["lower than 18","18-25","more than 25"])
        .range(["#654A18", "#81683B", "#9E8963"]); 
        var xAxis = d3.axisBottom(xScale).ticks(5);
        var yAxis = d3.axisLeft(yScale);

        var formatDate = d3.timeFormat("Year %Y");
        var parseDate = d3.timeParse("Year %Y");

        var stack = d3.stack();

        d3.csv("data/03deaths_04yearsold_excerpt.csv", function(error, data) {

            if (error) { console.log(error); };

            // wide data
            var dataset =  d3.nest()
                .key(function(d) { return d.Year; }).sortKeys(d3.ascending)
                .rollup(function(d) { 
                    return d.reduce(function(prev, curr) {
                      prev["Year"] = curr["Year"];
                      prev[curr["Country"]] = curr["Schools"];
                      return prev;
                    }, {});
                })
                .entries(data)
                .map(function(d) { return d.value; });

             console.log("dataset", dataset)

            var country = 
				["lower than 18","18-25","more than 25"]
//["Anhui","Beijing","Chongqing","Guangdong","Guangxi","Guangzhou","Heilongjiang","Henan","Hubei","Hunan","Jiangxi","Jilin","Liaoning","Shaanxi","Shanghai","Shanxi","Sichuan","Tianjin","Xinjiang","Yunnan","Zhejiang"]

            stack.keys(country)

            xScale.domain(dataset.map(function(d){ return d.Year;} ))

           // 1. default "Count"
            // 1.1 初始参数
            stack.offset(d3.stackOffsetNone);
            var layers = stack(dataset);
                       
            draw(layers);

            // 1.2 初始stacks
            var series = svg.selectAll("g.series")
                .data(layers);
            series
                .enter().append("g")
                .attr("class", "series")
                .style("fill", function(d) { return colorScale(d.key); })

            series
                .selectAll("rect.rect")
                .data(function(d){ return d; })
                .enter().append("rect")
                .attr("class","rect")
                .attr("x",function(d) { return xScale(d.data.Year); })
                .attr("y",function(d) { return yScale(d[1]); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]) ; })

            // 1.3 初始click
            d3.selectAll("input").on("change", handleFormClick);

            // 2 update 
            // 2.1 update handler
            function handleFormClick() {
                if (this.value === "bypercent") { 
                    currentMode = "bypercent"; 

                    yAxis.tickFormat(d3.format(".0%"));
                    stack.offset(d3.stackOffsetExpand);
                    layers = stack(dataset);
                    draw(layers);
                } else {
                    currentMode = "bycount"; 
                    
                    yAxis.tickFormat(d3.format(",.0f"));
                    stack.offset(d3.stackOffsetNone);
                    layers = stack(dataset);
                    draw(layers);
                }
            }

            // 2.2 update draw data
            function draw(layers){

                // layers = stack(dataset);
                // console.log("layers", layers); 
                var maxY = d3.max(
                    layers,  function(l){
                        return d3.max(l, function(d) { return d[1]; })
                    }
                ) 
                yScale.domain([0, maxY]); 

                var series = svg.selectAll("g.series")
                    .data(layers)

                series
                    .enter().append("g")
                    .attr("class", "series")
                    .style("fill", function(d) { return colorScale(d.key); })

                // var rects = series
                series
                    .selectAll("rect.rect")
                    .data(function(d){ return d; })
                    .enter().append("rect")
                    .attr("class","rect")
                    .attr("x",function(d) { return xScale(d.data.Year); })
                    .attr("width", xScale.bandwidth())

                d3.selectAll("rect.rect")
                    .transition()
                    .duration(250)
                    .attr("y",function(d) { return yScale(d[1]); })
                    .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]) ; })
                    // .append("title")
                    // .text(function(d) {
                    //     return d.key; // country is the key in the nest
                    // });
                series.exit().remove()
                svg.selectAll(".y.axis").transition().call(yAxis);

            } // end of draw()

            
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
              // 图例 legend, based on http://bl.ocks.org/mbostock/3886208

            // layers的数据顺序并不是从0到max去排的，所以我们需要先手动排一下
            layers.sort(function(a,b){
                return a[0][0] - b[0][0];
            })
            var layers_key = layers.map(function(l){ return l.key; })

            // 数据的顺序是从基线往上，但我们给legend需要从上往下，所以要.reverse()
            var legend_order = layers_key.slice().reverse();

            console.log("legend_order",legend_order);

            var legend = svg.selectAll(".legend")
                .data(legend_order)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width + 20)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d) {return colorScale(d);}); // country name

            legend.append("text")
                .attr("x", width + 45)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d, i) { return legend_order[i]/*.replace(/_/g, " ");*/ });
            

        }); // end of d3.csv
// JavaScript Document