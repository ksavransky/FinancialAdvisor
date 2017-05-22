import React from 'react';
import merge from 'lodash/merge';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
  }

  createTable(){
    let labels = this.props.labels;

    let fields = [{ name: "Risk", type: "number", width: 50}];
    labels.forEach((label)=>{
      fields.push({ name: label + " %", type: "number", width: 100})
    })

    $("#jsGrid").jsGrid({
        width: "700px",
        height: "386px",
        align: "center",

        inserting: false,
        editing: false,
        sorting: false,
        paging: false,

        data: this.props.riskTable,
        fields: fields
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
