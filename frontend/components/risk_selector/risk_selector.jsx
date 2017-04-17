// import TodoListItem from './todo_list_item';
// import TodoForm from './todo_form';

import React from 'react';

class RiskSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {risk: 0};
    this.setRisk = this.setRisk.bind(this);
    this.highlightRow = this.highlightRow.bind(this);
    this.highlightNumber = this.highlightNumber.bind(this);
  }

  setRisk(e) {
     e.preventDefault();
     console.log(e.target.innerHTML);
    this.setState({ risk: e.target.innerHTML });
    this.highlightRow();
    this.highlightNumber();
  }

  highlightNumber(){
     $('li').css('background', 'white');
     $($('ul')[0].children[this.state.risk - 1]).css("background-color", "gold");;
  }


  highlightRow(){
    for (let i = 0; i < 10; i++){
      if (i % 2 == 0) {
        $($($('tbody')[0].children[i])[0].children).css('background','#fcfcfc');
      } else {
        $($($('tbody')[0].children[i])[0].children).css('background','#fff');
      }
    }

    let $row = $($('tbody')[0].children[this.state.risk - 1]);
    $($row[0].children).css("background-color", "gold");
  }


  componentDidMount() {
    let ul = document.createElement("ul");
    ul.classList.add('risk-selector-ul');
    $("#risk-selector").append(ul);

    for(let i = 0; i < 10; i++){
      let li = document.createElement("li");
      li.innerHTML = `${i + 1}`;
      li.addEventListener('click', this.setRisk);
      $(".risk-selector-ul")[0].append(li);
    }


var riskTable = [
    { "Risk": 1, "Bonds %": 80, "Large Cap %": 20, "Mid Cap %": 0, "Foreign %": 0, "Small Cap %": 0  },
    { "Risk": 2, "Bonds %": 70, "Large Cap %": 15, "Mid Cap %": 15, "Foreign %": 0, "Small Cap %": 0  },
    { "Risk": 3, "Bonds %": 60, "Large Cap %": 15, "Mid Cap %": 15, "Foreign %": 10, "Small Cap %": 0  },
    { "Risk": 4, "Bonds %": 50, "Large Cap %": 20, "Mid Cap %": 20, "Foreign %": 10, "Small Cap %": 0  },
    { "Risk": 5, "Bonds %": 40, "Large Cap %": 20, "Mid Cap %": 20, "Foreign %": 15, "Small Cap %": 5  },
    { "Risk": 6, "Bonds %": 25, "Large Cap %": 25, "Mid Cap %": 25, "Foreign %": 20, "Small Cap %": 5  },
    { "Risk": 7, "Bonds %": 20, "Large Cap %": 25, "Mid Cap %": 25, "Foreign %": 25, "Small Cap %": 5  },
    { "Risk": 8, "Bonds %": 10, "Large Cap %": 20, "Mid Cap %": 40, "Foreign %": 20, "Small Cap %": 10  },
    { "Risk": 9, "Bonds %": 0, "Large Cap %": 20, "Mid Cap %": 40, "Foreign %": 25, "Small Cap %": 15  },
    { "Risk": 10, "Bonds %": 0, "Large Cap %": 10, "Mid Cap %": 30, "Foreign %": 30, "Small Cap %": 40  }
]

$("#jsGrid").jsGrid({


    width: "700px",
    height: "386px",
    align: "center",

    inserting: false,
    editing: false,
    sorting: true,
    paging: false,

    data: riskTable,

    fields: [
        { name: "Risk", type: "number", width: 50},
        { name: "Bonds %", type: "number", width: 100 },
        { name: "Large Cap %", type: "number", width: 100 },
        { name: "Mid Cap %", type: "number", width: 100 },
        { name: "Foreign %", type: "number", width: 100 },
        { name: "Small Cap %", type: "number", width: 100 }
    ]
});

///DONUT

// Seed data to populate the donut pie chart
var seedData = [{
  "label": "Bonds",
  "value": 35
}, {
  "label": "Large Cap",
  "value": 30
}, {
  "label": "Mid Cap",
  "value": 20
}, {
  "label": "Foreign",
  "value": 10
}, {
  "label": "Small Cap",
  "value": 5
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



  render() {



    return(
<div id="risk-selector-container">
      <div id="risk-selector"></div>
      <div id="jsGrid"></div>
       <svg id="donut-chart"></svg>
</div>
    );
  }
}

export default RiskSelector;
