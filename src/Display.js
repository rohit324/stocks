
import React from 'react';
import PositionsData from './PositionsData';
import TestTable from './TestTable';
import Table from 'react-bootstrap/Table';
class Display extends React.Component {

    data = this.tableSource();

    handleChange(event) {
        console.log(event.target.value);
        const filter = event.target.value;
        const filteredData = new PositionsData().getFilteredData(filter);
        console.log(this.data);
        this.data = filteredData;
      }

    render() {
        return (<div style={{padding:'50px'}}> <Table striped bordered hover>
            <tr><td><input name="search" onChange={this.handleChange} /></td></tr>
        </Table>
            <TestTable data={this.data}></TestTable></div>)
    }

    tableSource() {
        return new PositionsData().getFormattedData()
    }
}

export default Display;