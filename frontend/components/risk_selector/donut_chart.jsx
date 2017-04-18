import React from 'react';
// import TodoDetailViewContainer from './todo_detail_view_container';
import merge from 'lodash/merge';

class DonutChart extends React.Component {
  constructor(props) {
    super(props);
    this.createDonut = this.createDonut.bind(this);
  }

  createDonut(){
    $('svg').html('');
    let risk = this.props.riskLevel
    let riskTable = this.props.riskTable
    let riskRow = riskTable[risk - 1];

    var riskAmounts= [1, 1, 1, 1, 1];
    var riskLabels = ["","","","",""];

    if (risk !== 0){
      riskLabels = ["Bonds","Large Cap","Mid Cap","Foreign","Small Cap"]
      riskAmounts = [riskRow["Bonds %"], riskRow["Large Cap %"],
                        riskRow["Mid Cap %"], riskRow["Foreign %"], riskRow["Small Cap %"]];
      riskAmounts.forEach((amount, idx) => {
        if(amount == 0){
          riskLabels[idx] = '';
        }
      })
    }

    var seedData = [{
      "label": riskLabels[0],
      "value": riskAmounts[0]
    }, {
      "label": riskLabels[1],
      "value": riskAmounts[1]
    }, {
      "label": riskLabels[2],
      "value": riskAmounts[2]
    }, {
      "label": riskLabels[3],
      "value": riskAmounts[3]
    }, {
      "label": riskLabels[4],
      "value": riskAmounts[4]
    }];

    // Define size & radius of donut pie chart
    var width = 450,
        height = 450,
        radius = Math.min(width, height) / 2;

    // Define arc colours
    var colour = d3.scaleOrdinal(d3.schemeCategory20);

    // Define arc ranges
    var arcText = d3.scaleOrdinal()
      .range([0, width]);

    // Determine size of arcs
    var arc = d3.arc()
      .innerRadius(radius - 130)
      .outerRadius(radius - 10);

    // Create the donut pie chart layout
    var pie = d3.pie()
      .value(function (d) { return d["value"]; })
      .sort(null);

    // Append SVG attributes and append g to the SVG
    var svg = d3.select("#donut-chart")
      .attr("width", width)
      .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    // Define inner circle
    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 100)
      .attr("fill", "#fff") ;

    // Calculate SVG paths and fill in the colours
    var g = svg.selectAll(".arc")
      .data(pie(seedData))
      .enter().append("g")
      .attr("class", "arc")

      // Append the path to each g
      g.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {
          return colour(i);
        });

      // Append text labels to each arc
      g.append("text")
        .attr("transform", function(d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#fff")
        .text(function(d,i) { return seedData[i].label; })

    g.selectAll(".arc text").call(wrap, arcText.range([0, width]));

    // Append text to the inner circle
    svg.append("text")
      .attr("dy", "-0.5em")
      .style("text-anchor", "middle")
      .attr("class", "inner-circle")
      .attr("fill", "#36454f")
      .text(function(d) { return 'Investment'; });

    svg.append("text")
      .attr("dy", "1.0em")
      .style("text-anchor", "middle")
      .attr("class", "inner-circle")
      .attr("fill", "#36454f")
      .text(function(d) { return 'Portfolio'; });

    // Wrap function to handle labels with longer text
    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        console.log("tspan: " + tspan);
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > 90) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  }

  componentDidMount(){
    this.createDonut();
  }

  componentDidUpdate(){
    this.createDonut();
  }

  render() {
    return (
      <svg id="donut-chart"></svg>
    );
  }
}

export default DonutChart;
