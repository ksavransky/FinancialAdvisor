import Table from './table.jsx';
import DonutChart from './donut_chart.jsx';

import React from 'react';

class RiskSelector extends React.Component {
  constructor(props) {
      super(props);
      this.state = {risk: 0,
      riskTable: [
          { "Risk": 1, "Bonds %": 80, "Large Cap %": 20, "Mid Cap %": 0, "Foreign %": 0, "Small Cap %": 0  },
          { "Risk": 2, "Bonds %": 70, "Large Cap %": 15, "Mid Cap %": 15, "Foreign %": 0, "Small Cap %": 0  },
          { "Risk": 3, "Bonds %": 60, "Large Cap %": 15, "Mid Cap %": 15, "Foreign %": 10, "Small Cap %": 0  },
          { "Risk": 4, "Bonds %": 50, "Large Cap %": 20, "Mid Cap %": 20, "Foreign %": 10, "Small Cap %": 0  },
          { "Risk": 5, "Bonds %": 40, "Large Cap %": 20, "Mid Cap %": 20, "Foreign %": 15, "Small Cap %": 5  },
          { "Risk": 6, "Bonds %": 25, "Large Cap %": 25, "Mid Cap %": 25, "Foreign %": 20, "Small Cap %": 5  },
          { "Risk": 7, "Bonds %": 20, "Large Cap %": 25, "Mid Cap %": 25, "Foreign %": 25, "Small Cap %": 5  },
          { "Risk": 8, "Bonds %": 10, "Large Cap %": 20, "Mid Cap %": 40, "Foreign %": 20, "Small Cap %": 10  },
          { "Risk": 9, "Bonds %": 0, "Large Cap %": 20, "Mid Cap %": 40, "Foreign %": 25, "Small Cap %": 15  },
          { "Risk": 10, "Bonds %": 0, "Large Cap %": 10, "Mid Cap %": 20, "Foreign %": 30, "Small Cap %": 40  },
          { "Risk": 11, "Bonds %": 10, "Large Cap %": 10, "Mid Cap %": 25, "Foreign %": 25, "Small Cap %": 40  }
      ],
      labels: ["Bonds", "Large Cap", "Mid Cap", "Foreign", "Small Cap"]
    };
    this.setRisk = this.setRisk.bind(this);
    this.createNumList = this.createNumList.bind(this);
    this.highlightNumber = this.highlightNumber.bind(this);
    this.highlightRow = this.highlightRow.bind(this);
    this.goToCalculator = this.goToCalculator.bind(this);
    this.changeGraphic = this.changeGraphic.bind(this);
  }

createNumList(){
    let ul = document.createElement("ul");
    ul.classList.add('risk-selector-ul');
    $("#risk-selector").append(ul);

    for(let i = 0; i < 10; i++){
      let li = document.createElement("li");
      li.innerHTML = `${i + 1}`;
      li.addEventListener('click', this.setRisk);
      $(".risk-selector-ul")[0].append(li);
    }
}

  setRisk(e) {
    e.preventDefault();
    this.setState({ risk: e.target.innerHTML });
    this.highlightRow();
    this.highlightNumber();
    $('#continue').css('opacity', '1.0');
  }

  highlightNumber(){
     $('li').css('background', 'white');
     $($('ul')[0].children[this.state.risk - 1]).css("background-color", "#e6ff3f");
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
    $($row[0].children).css("background-color", "#e6ff3f");
  }

  goToCalculator() {
    if($('#continue').css('opacity') == 1.0) {
        this.props.history.push('/calculator');
    }
  }

  changeGraphic(){
    if($('#donut-chart').css('display') == 'none'){
      $('#donut-chart').css('display', 'block');
      $('#jsGrid').css('display', 'none');
      $("#view-logo img").attr("src","../app/assets/images/chartlogo.jpg");
    } else {
      $('#donut-chart').css('display', 'none');
      $('#jsGrid').css('display', 'block');
      $("#view-logo img").attr("src","../app/assets/images/donutlogo.png");
    }
  }

  componentDidMount() {
    this.createNumList();
  }

  componentWillUnmount(){
    this.props.receiveRisk({"risk": parseInt(this.state.risk), "riskTable": this.state.riskTable, "labels": this.state.labels});
  }

  render() {
    return(
      <div id="risk-selector-container">
        <div className="risk-selector-header-labels">
          <div className="risk-label-select">Please Select Risk Level</div>
          <div className="risk-label-levels">
            <div className="risk-label">Low</div>
            <div className="risk-label">High</div>
          </div>
        </div>
        <div id="risk-selector-header">
          <div id="risk-selector"></div>
          <div id="continue" className="button" onClick={this.goToCalculator}>Continue</div>
        </div>
        <div id="graphic">
          <Table riskTable={this.state.riskTable}/>
          <DonutChart riskLevel={this.state.risk} riskTable={this.state.riskTable} labels={this.state.labels}/>
          <div id="view-logo" onClick={this.changeGraphic}><img src="../app/assets/images/donutlogo.png"/></div>
        </div>
      </div>
    );
  }
}

export default RiskSelector;
