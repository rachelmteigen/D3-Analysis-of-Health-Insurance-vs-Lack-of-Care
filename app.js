// Step 0: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Append an SVG group
var chart = svg.append("g");


// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function(err, censusData) {
  if (err) throw err;

  censusData.forEach(function(data) {
    data.Abbr = data.Abbr
    // console.log(data.Abbr);
    data.Uninsured = +data.Uninsured;
    data.DoctorNeed = +data.DoctorNeed;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // These variables store the minimum and maximum values in a column in data.csv
  var xMin;
  var xMax;
  var yMax;

  // This function identifies the minimum and maximum values in a column in hairData.csv
  // and assign them to xMin and xMax variables, which will define the axis domain
  function findMinAndMax(dataColumnX) {
    xMin = d3.min(censusData, function(data) {
      return +data[dataColumnX] * 0.8;
    });

    xMax = d3.max(censusData, function(data) {
      return +data[dataColumnX] * 1.1;
    });

    yMax = d3.max(censusData, function(data) {
      return +data.DoctorNeed * 1.1;
    });
  }

  // The default x-axis is 'hair_length'
  // Another axis can be assigned to the variable during an onclick event.
  // This variable is key to the ability to change axis/data column
  var currentAxisLabelX = "Uninsured";

  // Call findMinAndMax() with 'hair_length' as default
  findMinAndMax(currentAxisLabelX);

  // Set the domain of an axis to extend from the min to the max value of the data column
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([0, yMax]);

  chart
    .selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(+data[currentAxisLabelX]);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(data.DoctorNeed);
    })
    .attr("r", "15")
    .attr("fill", "#6091e0")

  svg.selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .text(function (data) {
      return data.Abbr
    })
    .attr("x", function (data) {
      return xLinearScale(+data[currentAxisLabelX]);
    })
    .attr("y", function(data) {
      return yLinearScale(data.DoctorNeed);
    })
    .attr("font_family", "sans-serif")
    .attr("font-size", "11px")
    .style("fill", "#000000")

  // Append an SVG group for the x-axis, then display the x-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(bottomAxis);

  // Append a group for y-axis, then display it
  chart.append("g").call(leftAxis);

  // Append y-axis label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "Need for Doctors")
    .text("Lack Access to Doctors Due to Cost %");

  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    // This axis label is active by default
    .attr("class", "axis-text active")
    .attr("data-axis-name", "Uninsured")
    .text("Lack of Insurance %");

});
