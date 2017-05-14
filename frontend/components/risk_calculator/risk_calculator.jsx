import React from 'react';

class RiskCalculator extends React.Component {
  constructor(props) {
      super(props);
      this.state = {money: 0};
      this.createTable = this.createTable.bind(this);
      this.createMain = this.createMain.bind(this);
      this.calculateAllocation = this.calculateAllocation.bind(this);
      this.rebalance = this.rebalance.bind(this);
      this.checkErrorsAndSetTotal = this.checkErrorsAndSetTotal.bind(this);
  }

  checkErrorsAndSetTotal(){
    let totalAmount = 0;
    $('.risk-calculator-main-input').each(function(idx){
      if(/\D/.test(this.value) || this.value < 0){
          $('.risk-calculator-transfers')[0].innerHTML = "Please use only positive digits when entering current amount.";
          totalAmount = 0;
      } else {
        totalAmount += parseInt(this.value);
      }
    })
    console.log("setting total amount of $ to: " + totalAmount);
    this.setState({ money: totalAmount});
  }

  rebalance(){
      this.checkErrorsAndSetTotal()
  }

  calculateAllocation(){
    let risk = this.props.risk;
    let riskLevel = risk.risk.risk;
    let riskRow = risk.risk.riskTable[riskLevel - 1];
    let riskRowValues = Object.values(riskRow).slice(1);
    let riskPercents = riskRowValues.map(value => {
          if(value == 0){
           return 0;
          } else {
          return value / 100;
          }
      });


    let theReturn = [riskPercents.map(percent => {
      return Math.ceil(100*(percent * this.state.money))/100
    }), riskRowValues]
    console.log(theReturn);
    return theReturn;
  }


  createMain(){
    ["Bonds", "Large Cap", "Mid Cap", "Foreign", "Small Cap"].forEach(function(label){
      $('.risk-calculator-main').append(`
        <div class='risk-calculator-main-row'>
            <label>${label} $:</label>
            <div style='position:absolute;left:103px;'>
              <input class='risk-calculator-main-input' type='text'/>
              <input disabled type='text'/>
              <input disabled type='text'/>
            </div>
        </div>`)
    })
  }

  createTable(){
    let allocation = this.calculateAllocation();

    let customRisk = [{"Bonds": allocation[1][0] + "%", "Large Cap": allocation[1][1] + "%", "Mid Cap": allocation[1][2] + "%",
                      "Foreign": allocation[1][3] + "%", "Small Cap": allocation[1][4] + "%"}];

    $("#customRiskTable").jsGrid({
        width: "700px",
        height: "70px",
        align: "center",

        inserting: false,
        editing: false,
        sorting: false,
        paging: false,

        data: customRisk,

        fields: [
            { name: "Bonds", type: "number", width: 70 },
            { name: "Large Cap", type: "number", width: 70 },
            { name: "Mid Cap", type: "number", width: 70 },
            { name: "Foreign", type: "number", width: 70 },
            { name: "Small Cap", type: "number", width: 70 }
        ]
    });
  }

  componentDidMount(){
    this.createTable();
    this.createMain();
  }

  componentDidUpdate(){
    this.createTable();
    this.calculateAllocation();
  }

  render() {
    return(
      <div className="risk-calculator-container">
          <div className="risk-calculator-label">Personalized Portfolio</div>
          <div className="risk-calculator-label-container">
            <div className="risk-calculator-label-risk">Risk Level {this.props.risk.risk.risk}</div>
          </div>
          <div id="customRiskTable"></div>
          <div id="currentInvestmentContainer">Please Enter Your Current Portfolio
            <div className="button" id="rebalance-button" onClick={this.rebalance}>Rebalance</div>
          </div>
          <div className="risk-calculator-input-container">
              <div className="risk-calculator-input-labels">
                  <label>Current Amount</label>
                  <label>Difference</label>
                  <label>New Amount</label>
                  <label>Recommended Transfers</label>
              </div>
              <div className="risk-calculator-main">
                <input className='risk-calculator-transfers' type='text' disabled/>
              </div>
          </div>
      </div>
    );
  }
}

export default RiskCalculator;
