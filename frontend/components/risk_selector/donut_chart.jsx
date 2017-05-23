import React from 'react';
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
    var arcToSmallIdx = [];

    if (risk !== 0){
      riskLabels = this.props.labels.slice(0);
      riskAmounts = Object.values(riskRow).slice(1);
      riskAmounts.forEach((amount, idx) => {
        if(amount == 0){
          riskLabels[idx] = '';
        } else if(amount < 10){
          arcToSmallIdx.push(idx);
        }
      })
    }

    var seedData = [];

    riskLabels.forEach((label, idx)=>{
     seedData.push({"label": label, "value": riskAmounts[idx]})
    })

    // Define size & radius of donut pie chart
    var width = 500,
        height = 500,
        radius = Math.min(width, height) / 2;

    // Define arc colors
    var color = d3.scaleOrdinal(d3.schemeCategory20);

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

// svg.append("line")
//                           .attr("x1", 5)
//                           .attr("y1", 5)
//                         .attr("x2", 50)
//                          .attr("y2", 50)
//                         .attr("stroke-width", 2)
//                          .attr("stroke", "black");
    // Define inner circle
    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 120)
      .attr("fill", "#fff") ;

    // Calculate SVG paths and fill in the colors
    var g = svg.selectAll(".arc")
      .data(pie(seedData))
      .enter().append("g")
      .attr("class", "arc")

      // Append the path to each g
      g.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {
console.log(d)
          return color(i);
        });

g.append("line")
                       .attr("x1", 5)
                         .attr("y1", 5)
                        .attr("x2", 50)
                        .attr("y2", 50)
                         .attr("stroke-width", 2)
                       .attr("stroke", "black");

      // Append text labels to each arc
      g.append("text")
        .attr("transform", function(d) {
          let arcCentroidCoords = arc.centroid(d);
          if(d["data"].value < 10){
            if(arcCentroidCoords[0] >= 0){
              arcCentroidCoords[0] = arcCentroidCoords[0] + 10;
            } else {
              arcCentroidCoords[0] = arcCentroidCoords[0] - 10;
            }
            if(arcCentroidCoords[1] >= 0){
              arcCentroidCoords[1] = arcCentroidCoords[1] + 73;
            } else {
              arcCentroidCoords[1] = arcCentroidCoords[1] - 73;
            }
          }
          return "translate(" + arcCentroidCoords + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#fff")
        .text(function(d,i) {
          return seedData[i].label;
        })

        arcToSmallIdx.forEach((idx)=>{
          $($($('.arc')[idx])[0].children[1]).css('fill', 'black')
        })

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
