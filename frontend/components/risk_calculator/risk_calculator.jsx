import React from 'react';

class RiskCalculator extends React.Component {
  constructor(props) {
      super(props);
      this.state = {money: 0};
      this.setInput = this.setInput.bind(this);
      this.createTable = this.createTable.bind(this);
      this.goToSelector = this.goToSelector.bind(this);
      this.calculateAllocation = this.calculateAllocation.bind(this);
  }

  setInput(e){
    e.preventDefault()
    $('.risk-calculator-error-message')[0].innerHTML = "";
    let input = $(e.target)[0].value;
    if(/\D/.test(input)){
      $('.risk-calculator-error-message')[0].innerHTML = "Please use digits.";
    } else {
      this.setState({ money: $(e.target)[0].value });
    }
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

    return [riskPercents.map(percent => {
      return Math.ceil(100*(percent * this.state.money))/100
    }), riskRowValues]
  }

  createTable(){
    let allocation = this.calculateAllocation();

    let customRisk = [{"Bonds": allocation[1][0] + "%", "Large Cap": allocation[1][1] + "%", "Mid Cap": allocation[1][2] + "%",
                      "Foreign": allocation[1][3] + "%", "Small Cap": allocation[1][4] + "%"},
                      { "Bonds": "$" + allocation[0][0], "Large Cap": "$" + allocation[0][1], "Mid Cap": "$" + allocation[0][2],
                      "Foreign": "$" + allocation[0][3], "Small Cap": "$" + allocation[0][4] }];

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
  goToSelector() {
    this.props.history.push('/home');
  }

  componentDidMount(){
    this.createTable();
  }

  componentDidUpdate(){
    this.createTable();
  }

  render() {
    return(
      <div className="risk-calculator-container">
          <div className="risk-calculator-label">Personalized Portfolio</div>
          <div className="risk-calculator-label-container">
            <div className="risk-calculator-label-risk">Risk Level {this.props.risk.risk.risk}</div>
            <div className="button" id="start-over-button" onClick={this.goToSelector}>Start Over</div>
          </div>
          <div id="customRiskTable"></div>
          <div id="currentInvestmentLabel">Please Enter Your Current Portfolio</div>
          <div className="risk-calculator-input-container">
              <div className="risk-calculator-input-labels">
                  <label>Current Investment</label>
                  <label>Difference</label>
                  <label>New Investment</label>
              </div>
              <div className="risk-calculator-main">
                <div className="risk-calculator-main-row">
                  <label>Bonds $:</label>
                  <div className="risk-calculator-row-inputs">
                    <input type="text"/>
                    <input disabled type="text"/>
                    <input disabled type="text"/>
                  </div>
                </div>
                <div className="risk-calculator-main-row">
                  <label>Small Cap $:</label>
                  <div className="risk-calculator-row-inputs">
                    <input type="text"/>
                    <input type="text"/>
                    <input type="text"/>
                  </div>
                </div>
                <div className="risk-calculator-main-row">
                  <label>Large Cap $:</label>
                  <div className="risk-calculator-row-inputs">
                    <input type="text"/>
                    <input type="text"/>
                    <input type="text"/>
                  </div>
                </div>

              </div>

          </div>
      </div>
    );
  }
}

export default RiskCalculator;
