import React from 'react';
import merge from 'lodash/merge';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      riskTable: this.props.riskTable
    };
    this.createTable = this.createTable.bind(this);
  }

  createTable(){
    $("#jsGrid").jsGrid({
        width: "700px",
        height: "386px",
        align: "center",

        inserting: false,
        editing: false,
        sorting: false,
        paging: false,

        data: this.state.riskTable,

        fields: [
            { name: "Risk", type: "number", width: 50},
            { name: "Bonds %", type: "number", width: 100 },
            { name: "Large Cap %", type: "number", width: 100 },
            { name: "Mid Cap %", type: "number", width: 100 },
            { name: "Foreign %", type: "number", width: 100 },
            { name: "Small Cap %", type: "number", width: 100 }
        ]
    });
  }

  componentDidMount(){
    this.createTable();
  }

  render() {
    return (
      <div id="jsGrid"></div>
    );
  }
}

export default Table;
