import Table from './table.jsx';
import DonutChart from './donut_chart.jsx';

import React from 'react';

class RiskSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {risk: 0};
    this.changeGraphicIcon = this.changeGraphicIcon.bind(this);
    this.highlightNumber = this.highlightNumber.bind(this);
    this.highlightRow = this.highlightRow.bind(this);
    this.goToCalculator = this.goToCalculator.bind(this);
    this.processClick = this.processClick.bind(this);
    this.setPriorRiskLevel = this.setPriorRiskLevel.bind(this);
    this.setRisk = this.setRisk.bind(this);
  }

  changeGraphicIcon(){
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

    if(this.state.risk !== 0){
        let $row = $($('tbody')[0].children[this.state.risk - 1]);
        $($row[0].children).css("background-color", "#e6ff3f");
    }
  }

  goToCalculator() {
    if($('#continue').css('opacity') == 1.0) {
        this.props.history.push('/calculator');
    }
  }

  processClick(e) {
    this.setState({ risk: e.target.innerHTML });
  }

  setPriorRiskLevel(){
    if(this.props.riskState.risk){
      this.setState({ risk: this.props.riskState.risk.level });
    }
  }

  setRisk() {
    this.highlightRow();
    this.highlightNumber();
    $('#continue').css('opacity', '1.0');
  }

  componentWillMount(){
    if(!this.props.riskState.risk){
      this.props.receiveRisk({"level": this.state.risk, "table": [], "labels": [], "portfolio": []});
      this.props.requestRiskTable();
    }
  }

  componentDidMount() {
    this.setPriorRiskLevel();
  }

  componentDidUpdate() {
    this.setRisk();
  }

  componentWillUnmount(){
    let portfolio = ["", "", "", "", ""];
    if(this.props.riskState.risk){
      portfolio = this.props.riskState.risk.portfolio;
    }
    this.props.receiveRisk({"level": parseInt(this.state.risk), "table": this.props.riskState.risk.table, "labels": this.props.riskState.risk.labels, "portfolio": portfolio});
  }

  render() {
    let selectorNumArray = [];
    for(let i = 1; i < 11; i++){selectorNumArray.push(i)}

    let content = <div></div>;
    if(this.props.riskState.risk){
      content =
              <div id="risk-selector-container">
                  <div className="risk-selector-header-labels">
                    <div className="risk-label-select">Please Select A Risk Level For Your Investment Portfolio</div>
                    <div className="risk-label-levels">
                      <div className="risk-label">Low</div>
                      <div className="risk-label">High</div>
                    </div>
                  </div>
                  <div id="risk-selector-button-container">
                    <div id="risk-selector">
                      <ul className="risk-selector-ul">
                          {selectorNumArray.map((num) =>
                                  <li key={num} onClick={this.processClick}>
                                    {num}
                                  </li>
                          )}
                      </ul>
                    </div>
                    <div id="continue" className="button" onClick={this.goToCalculator}>Continue</div>
                  </div>
                  <div id="graphic">
                    <Table riskTable={this.props.riskState.risk.table} labels={this.props.riskState.risk.labels}/>
                    <DonutChart riskLevel={this.state.risk} riskTable={this.props.riskState.risk.table} labels={this.props.riskState.risk.labels}/>
                    <div id="view-logo" onClick={this.changeGraphicIcon}><img src="../app/assets/images/donutlogo.png"/></div>
                  </div>
                </div>
    }
    return(
      content
    );
  }
}

export default RiskSelector;
