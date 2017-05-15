import React from 'react';

class RiskCalculator extends React.Component {
  constructor(props) {
      super(props);
      this.state = {money: 0};
      this.createTable = this.createTable.bind(this);
      this.createMain = this.createMain.bind(this);
      this.calculateAllocation = this.calculateAllocation.bind(this);
      this.rebalance = this.rebalance.bind(this);
      this.recordTransfers = this.recordTransfers.bind(this);
      this.checkErrorsAndSetTotal = this.checkErrorsAndSetTotal.bind(this);
      this.recordNewAmountAndDifference = this.recordNewAmountAndDifference.bind(this);
  }

  checkErrorsAndSetTotal(){
    let totalAmount = 0;
    let validInput = true;
    $('.risk-calculator-main-input').each(function(idx){
      if(/\D/.test(this.value) || this.value < 0 || this.value == ""){
          $('.risk-calculator-transfers')[0].innerHTML = "Please use only positive digits or zero when entering current amounts.";
          $($('.risk-calculator-transfers')[0]).css('color', 'red');
          validInput = false;
      } else {
        totalAmount += parseInt(this.value);
      }
    })
    if(validInput){
      $($('.risk-calculator-transfers')[0]).css('color', 'black');
      this.setState({money: totalAmount});
    }
  }

  rebalance(){
      this.checkErrorsAndSetTotal()
  }


  recordTransfers(differences, counter = 0){
    let labels = ["Bonds", "Large Cap", "Mid Cap", "Foreign", "Small Cap"];
    let newDifferences = differences.slice(0);

    function sortNumber(a,b) {
        return a - b;
    }
    let sortedDiff = differences.sort(sortNumber)

    // console.log("sorted differences: " + sortedDiff);
    let transferMade = false;
    let smallestFittingDeficit = null;
    sortedDiff.slice(0).reverse().forEach(function(surplus){
       // starting with the largest surplus, iterate
       if(!transferMade && surplus > 0){
         // compare surplus to deficiet starting with deficits starting with smallest; find the smallest deficit into which the surplus fits
          sortedDiff.forEach(function(deficit){
          // console.log("in inner each and the surplus is: " + surplus + " and the deficit is: " + deficit)
          if(surplus + deficit <= 0){
              smallestFittingDeficit = deficit;
            }
          })

          if(smallestFittingDeficit){
          // console.log("in inner each and the surplus is: " + surplus + " and the deficit is: " + smallestFittingDeficit + " and the surplus + deficit is " + surplus + smallestFittingDeficit)
              let surplusIdx = newDifferences.indexOf(surplus)
              let deficitIdx = newDifferences.indexOf(smallestFittingDeficit)
              newDifferences[surplusIdx] = 0;
              newDifferences[deficitIdx] = surplus + smallestFittingDeficit;
              let transferString = `Transfer $${Math.ceil(100*surplus)/100} from ${labels[surplusIdx]} to ${labels[deficitIdx]}.\n`
              $('.risk-calculator-transfers')[0].innerHTML += transferString;
              transferMade = true;
          }
       }
    })

    if(!transferMade){
      sortedDiff.forEach(function(smallestSurplus){
        if(smallestSurplus > 0){
          sortedDiff.slice(0).reverse().forEach(function(smallestDeficit){
            if(!transferMade && smallestDeficit < 0){
              let surplusIdx = newDifferences.indexOf(smallestSurplus);
              let deficitIdx = newDifferences.indexOf(smallestDeficit);
              newDifferences[surplusIdx] = smallestSurplus + smallestDeficit;
              newDifferences[deficitIdx] = 0;

              let transferString = `Transfer $${Math.ceil(100*(smallestSurplus - (smallestSurplus + smallestDeficit)))/100} from ${labels[surplusIdx]} to ${labels[deficitIdx]}.\n`
              $('.risk-calculator-transfers')[0].innerHTML += transferString;
              transferMade = true;
            }
          })
        }
      })
    }

    let newLastLargestNumber = newDifferences.slice(0).sort(sortNumber).reverse()[0]

    counter += 1
    if(newLastLargestNumber !== 0 && counter < 10){
      this.recordTransfers(newDifferences, counter += 1);
    }
  }

  recordNewAmountAndDifference(){
    let allocation = this.calculateAllocation();
    let differences = [];

    allocation[0].forEach(function(newAmount, idx){
      $('.risk-calculator-main-new')[idx].value = newAmount;
      $($('.risk-calculator-main-new')[idx]).css('color', 'blue');
      let inputAmount = $('.risk-calculator-main-input')[idx].value;
      let difference = Math.ceil(100*(newAmount - inputAmount))/100;

      if (difference >= 0){
        $('.risk-calculator-main-difference')[idx].value = "+" + difference;
        $($('.risk-calculator-main-difference')[idx]).css('color', 'green');
      } else if (difference < 0){
        $('.risk-calculator-main-difference')[idx].value = difference;
        $($('.risk-calculator-main-difference')[idx]).css('color', 'red');
      }
      differences.push(difference);
    })

    $('.risk-calculator-transfers')[0].innerHTML = "";
    this.recordTransfers(differences);
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


  createMain(){
    ["Bonds", "Large Cap", "Mid Cap", "Foreign", "Small Cap"].forEach(function(label){
      $('.risk-calculator-main').append(`
        <div class='risk-calculator-main-row'>
            <label>${label} $:</label>
            <div style='position:absolute;left:103px;'>
              <input class='risk-calculator-main-input' type='text'/>
              <input class='risk-calculator-main-difference' disabled type='text'/>
              <input class='risk-calculator-main-new' disabled type='text'/>
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
    this.recordNewAmountAndDifference();
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
                <div className='risk-calculator-transfers'></div>
              </div>
          </div>
      </div>
    );
  }
}

export default RiskCalculator;
