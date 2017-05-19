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
          $('.risk-calculator-transfers')[0].innerHTML = "Please use only positive digits or zero when entering current amounts. Please enter all inputs correctly.";
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
    if($('#rebalance-button').css('opacity') == 1.0){
          this.checkErrorsAndSetTotal();
    }
  }


  recordTransfers(differences){
    let labels = this.props.riskState.risk.labels;
    let newDifferences = differences.slice(0);

    function sortNumber(a,b) {return a - b;}
    let sortedDiff = differences.sort(sortNumber)

    let transferMade = false;
    let smallestFittingDeficit = null;
    sortedDiff.slice(0).reverse().forEach(function(surplus){
       if(!transferMade && surplus > 0){
          sortedDiff.forEach(function(deficit){
              if(surplus + deficit <= 0){
                smallestFittingDeficit = deficit;
              }
          })

          if(smallestFittingDeficit){
              let surplusIdx = newDifferences.indexOf(surplus);
              let deficitIdx = newDifferences.indexOf(smallestFittingDeficit);
              newDifferences[surplusIdx] = 0;
              newDifferences[deficitIdx] = surplus + smallestFittingDeficit;
              let transferString = `<div>• Transfer $${Math.ceil(100*surplus)/100} from ${labels[deficitIdx]} to ${labels[surplusIdx]}.</div>`
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
              let transferString = `<div>• Transfer $${Math.ceil(100*(smallestSurplus - (smallestSurplus + smallestDeficit)))/100} from ${labels[deficitIdx]} to ${labels[surplusIdx]}.</div>`
              $('.risk-calculator-transfers')[0].innerHTML += transferString;
              transferMade = true;
            }
          })
        }
      })
    }

    if(newDifferences.filter(function(x){return x==0}).length < 4){
      this.recordTransfers(newDifferences);
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
    let riskState = this.props.riskState;
    let riskLevel = riskState.risk.level;
    let riskRow = riskState.risk.table[riskLevel - 1];
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
    this.props.riskState.risk.labels.forEach(function(label){
      $('.risk-calculator-main').append(`
        <div class='risk-calculator-main-row'>
            <label>${label} $:</label>
            <div style='position:absolute;left:103px;'>
              <input class='risk-calculator-main-input' type='text'/>
              <input class='risk-calculator-main-difference' disabled type='text'/>
              <input class='risk-calculator-main-new' disabled type='text'/>
            </div>
        </div>
        <script>
          $('.risk-calculator-main-input').keyup(function() {
              var allInputsEntered = true;
              $('.risk-calculator-main-input').each(function(el){
                if($(this)[0].value == ""){
                  allInputsEntered = false;
                  $('#rebalance-button').css('opacity','0.4');
                }
              })
              if(allInputsEntered){
                $('#rebalance-button').css('opacity','1.0');
              }
          });
        </script>`)
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

  componentWillUnmount(){
    this.props.receiveRisk({"risk": this.props.riskState.risk.level});
  }

  render(){
    return(
      <div className="risk-calculator-container">
          <div className="risk-calculator-label">Personalized Portfolio</div>
          <div className="risk-calculator-label-container">
            <div className="risk-calculator-label-risk">Risk Level {this.props.riskState.risk.level}</div>
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
