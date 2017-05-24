import React from 'react';

class RiskCalculator extends React.Component {
  constructor(props) {
      super(props);
      this.state = {money: 0};
      this.calculateAllocation = this.calculateAllocation.bind(this);
      this.checkErrorsAndSetTotal = this.checkErrorsAndSetTotal.bind(this);
      this.createTable = this.createTable.bind(this);
      this.inputCheck = this.inputCheck.bind(this);
      this.populatePortfolio = this.populatePortfolio.bind(this);
      this.rebalance = this.rebalance.bind(this);
      this.recordNewAmountAndDifference = this.recordNewAmountAndDifference.bind(this);
      this.recordTransfers = this.recordTransfers.bind(this);
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
      return Math.floor(100*(percent * this.state.money))/100
    }), riskRowValues]
  }

  checkErrorsAndSetTotal(){
    let totalAmount = 0;
    let validInput = true;
    let validRegEx = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
    $('.risk-calculator-main-input').each(function(idx){
      if(!validRegEx.test(this.value) || this.value < 0 || this.value == ""){
          $('.risk-calculator-transfers')[0].innerHTML = "Please use only positive digits or zero when entering current amounts. Please enter all inputs correctly.";
          $($('.risk-calculator-transfers')[0]).css('color', 'red');
          validInput = false;
      } else {
        totalAmount += parseFloat(this.value.replace(/[^0-9\.]+/g, ''));
      }
    })
    if(validInput){
      $($('.risk-calculator-transfers')[0]).css('color', 'black');
      this.setState({money: Math.floor(totalAmount * 100) / 100});
    }
  }

  createTable(){
    let allocation = this.calculateAllocation();
    let labels = this.props.riskState.risk.labels;

    let fields = [];
    labels.forEach((label)=>{
      fields.push({ name: label, type: "number", width: 70 })
    })

    let customRisk = {}
    labels.forEach((label, idx)=>{
      customRisk[label] = allocation[1][idx] + "%";
    })
    customRisk = [customRisk];

    $("#customRiskTable").jsGrid({
        width: "700px",
        height: "70px",
        align: "center",

        inserting: false,
        editing: false,
        sorting: false,
        paging: false,

        data: customRisk,
        fields: fields
    });
  }

  inputCheck(){
    let allInputsEntered = true;
    let portfolio = [];
    $('.risk-calculator-main-input').each(function(){
      if($(this)[0].value == ""){
        allInputsEntered = false;
        $('#rebalance-button').css('opacity','0.4');
      }
    })
    if(allInputsEntered){
      $('#rebalance-button').css('opacity','1.0');
    }
  }

  populatePortfolio(){
    this.props.riskState.risk.portfolio.forEach(function(amount, idx){
      $('.risk-calculator-main-input')[idx].value = amount;
    })
    this.inputCheck();
  }

  rebalance(){
    if($('#rebalance-button').css('opacity') == 1.0){
          this.checkErrorsAndSetTotal();
    }
  }

  recordNewAmountAndDifference(){
      let allocation = this.calculateAllocation();
      let differences = [];

      function nullifyRemainder(remIdx, differences){
          $('.risk-calculator-main-new')[remIdx].value = $('.risk-calculator-main-input')[remIdx].value.replace(/[^0-9\.]+/g, '');
          let $difference = $('.risk-calculator-main-difference')[remIdx];
          $difference.value = "+" + 0;
          $($difference).css('color', 'green');
          differences[remIdx] = 0;
      }

      allocation[0].forEach(function(newAmount, idx){
        $('.risk-calculator-main-new')[idx].value = newAmount;
        $($('.risk-calculator-main-new')[idx]).css('color', 'blue');
        let inputAmount = $('.risk-calculator-main-input')[idx].value.replace(/[^0-9\.]+/g, '');
        let difference = Math.round(100*(newAmount - inputAmount))/100;

        if (difference >= 0){
          $('.risk-calculator-main-difference')[idx].value = "+" + difference;
          $($('.risk-calculator-main-difference')[idx]).css('color', 'green');
        } else if (difference < 0){
          $('.risk-calculator-main-difference')[idx].value = difference;
          $($('.risk-calculator-main-difference')[idx]).css('color', 'red');
        }

        differences.push(difference);
      })

      var sum = 0;
      $('.risk-calculator-main-new').each((idx, el)=>{
         sum += parseFloat($(el)[0].value)
      })
      let remainder = Math.round(100*(sum - this.state.money))/100;
      let remainderIdx = differences.indexOf(remainder)

      if(remainderIdx !== -1 && remainder !== 0){
          nullifyRemainder(remainderIdx, differences);
      } else {
        let workingRemainder = remainder;
        while (workingRemainder < 0 && remainder !== 0) {
            workingRemainder = Math.round(100*(workingRemainder + 0.01))/100
            let workingRemainderIdx = differences.indexOf(workingRemainder);
            if(workingRemainderIdx !== -1){
              nullifyRemainder(workingRemainderIdx, differences);
              remainder -= workingRemainder;
            }
        }
      }

      $('.risk-calculator-transfers')[0].innerHTML = "";
      this.recordTransfers(differences);
   }

  recordTransfers(differences, counter = 0, recordedTransfers = []){
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
              let transferAmount = Math.round(100*surplus)/100;
              let transferString = `<div>• Transfer $${transferAmount} from ${labels[deficitIdx]} to ${labels[surplusIdx]}.</div>`
              $('.risk-calculator-transfers')[0].innerHTML += transferString;
              recordedTransfers.push({"from": deficitIdx, "to":surplusIdx, "amount": transferAmount});
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
              let transferAmount = Math.round(100*(smallestSurplus - (smallestSurplus + smallestDeficit)))/100;
              let transferString = `<div>• Transfer $${transferAmount} from ${labels[deficitIdx]} to ${labels[surplusIdx]}.</div>`
              $('.risk-calculator-transfers')[0].innerHTML += transferString;
              recordedTransfers.push({"from": deficitIdx, "to":surplusIdx, "amount": transferAmount});
              transferMade = true;
            }
          })
        }
      })
    }

    newDifferences = newDifferences.map((el)=>{return Math.round(100 * el)/100})

    let numOfZeroDifferences = newDifferences.filter(function(x){return x==0}).length;

    if(numOfZeroDifferences < 4 && counter < 7){
      this.recordTransfers(newDifferences, counter + 1, recordedTransfers);
    }
    else if (numOfZeroDifferences == 4){
      let amount = newDifferences.find((el)=>el !== 0);
      let surplusIdx = newDifferences.indexOf(amount);
      let largestAmount = $('.risk-calculator-main-new').map((idx, el)=>{
        return parseFloat(el.value);
      }).sort().last()[0]
      let deficitIdx;
      $('.risk-calculator-main-new').each((idx, el)=>{
           if(parseFloat(el.value) == largestAmount) {deficitIdx = idx};
      })

      $('.risk-calculator-main-new')[deficitIdx].value = Math.round(100 * (largestAmount - amount))/100;

      let newDif = largestAmount - amount - Math.round(100 * parseFloat($('.risk-calculator-main-input')[deficitIdx].value.replace(/[^0-9\.]+/g, '')))/100
      let addPlusSign = "+";
      if(newDif < 0){
        addPlusSign = "";
      }
      $('.risk-calculator-main-difference')[deficitIdx].value = addPlusSign + Math.round(100 * newDif)/100;

      let priorStringModified = false;
      recordedTransfers.forEach((transfer, idx)=>{
        if(transfer["from"] == surplusIdx && transfer["to"] == deficitIdx){
            let newAmount = Math.round(100 * (Math.abs(amount) + transfer["amount"]))/100
            let newString = `<div>• Transfer $${newAmount} from ${labels[surplusIdx]} to ${labels[deficitIdx]}.</div>`
            $('.risk-calculator-transfers div')[idx].innerHTML = newString;
            priorStringModified = true;
        }
      });

      if(!priorStringModified){
          let transferString = `<div>• Transfer $${Math.abs(amount)} from ${labels[surplusIdx]} to ${labels[deficitIdx]}.</div>`;
          $('.risk-calculator-transfers')[0].innerHTML += transferString;
      }
    }
  }

  componentDidMount(){
    this.createTable();
    this.populatePortfolio();
  }

  componentDidUpdate(){
    this.recordNewAmountAndDifference();
  }

  componentWillUnmount(){
    let portfolio = [];
    $('.risk-calculator-main-input').each(function(){
        portfolio.push($(this)[0].value);
    })
    this.props.updateRiskPortfolio(portfolio);
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
                  {this.props.riskState.risk.labels.map((label, key) =>
                          <div key={key} className='risk-calculator-main-row'>
                              <label>{label} $:</label>
                              <div className='risk-calculator-main-row-box'>
                                <input className='risk-calculator-main-input' onKeyUp={this.inputCheck} type='text'/>
                                <input className='risk-calculator-main-difference' disabled type='text'/>
                                <input className='risk-calculator-main-new' disabled type='text'/>
                              </div>
                          </div>
                  )}
                <div className='risk-calculator-transfers'></div>
              </div>
          </div>
      </div>
    );
  }
}

export default RiskCalculator;
