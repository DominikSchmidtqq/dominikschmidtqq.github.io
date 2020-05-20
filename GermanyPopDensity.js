/* http://bl.ocks.org/oscar6echo/4423770 */
var width = 960,
    height = 500,
    focused = null,
    geoPath;

var svg = d3.select("body")
  .append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
  .append("g")
    .attr("id", "states");
    
var color = d3.scale.log().domain([69, 4055]).range(["yellow", "red"])


d3.json("./Germany.json", function(collection) {
  for (i=0; i < 16; i++) {
      console.log(collection.features[i].properties.name + " " +collection.features[i].properties.popDensity + " "+ color(collection.features[i].properties.popDensity))
  }
    
  
  var bounds = d3.geo.bounds(collection),
      bottomLeft = bounds[0],
      topRight = bounds[1],
      rotLong = -(topRight[0]+bottomLeft[0])/2;
      center = [(topRight[0]+bottomLeft[0])/2+rotLong, (topRight[1]+bottomLeft[1])/2],
      
      //default scale projection
      projection = d3.geo.albers()
        .parallels([bottomLeft[1],topRight[1]])
        .rotate([rotLong,0,0])
        .translate([width/2,height/2])
        .center(center),
        
      bottomLeftPx = projection(bottomLeft),
      topRightPx = projection(topRight),
      scaleFactor = 1.00*Math.min(width/(topRightPx[0]-bottomLeftPx[0]), height/(-topRightPx[1]+bottomLeftPx[1])),
      
      projection = d3.geo.albers()
        .parallels([bottomLeft[1],topRight[1]])
        .rotate([rotLong,0,0])
        .translate([width/2,height/2])
        .scale(scaleFactor*0.975*1000)
        //.scale(4*1000)  //1000 is default for USA map
        .center(center);

  geoPath = d3.geo.path().projection(projection);
    
    
  g.selectAll("path.feature")
      .data(collection.features)
      .enter()
    .append("path")
      .attr("class", "feature")
      .attr("d", geoPath)
      .style("fill", function(d) {
					   		//Get population density value
					   		var value = d.properties.popDensity;
					   		
					   		if (value) {
					   			//If value exists…
						   		return color(value);
					   		} else {
					   			//If value is undefined…
						   		return "#ccc";
					   		}
					   });

  console.log("d3.json: bounds = "+bounds);
  console.log("d3.json: bottomLeft = "+bottomLeft);
  console.log("d3.json: topRight = "+topRight);
  console.log("d3.json: center = "+center);
  console.log("d3.json: projection(center) = "+projection(center));
  console.log("d3.json: projection(bottomLeft) = "+projection(bottomLeft));
  console.log("d3.json: projection(topRight) = "+projection(topRight));
  console.log("d3.json: topRightPx = "+topRightPx);
  console.log("d3.json: bottomLeftPx = "+bottomLeftPx);
  console.log("d3.json: scaleFactor x axis = "+width/(topRightPx[0]-bottomLeftPx[0]));
  console.log("d3.json: scaleFactor y axis = "+height/(-topRightPx[1]+bottomLeftPx[1]));  
  console.log("d3.json: scaleFactor = "+scaleFactor);
});


