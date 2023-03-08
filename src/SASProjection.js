import React from 'react';
import Table from 'react-bootstrap/Table';
import SASConstants from './SASConstants';
class SASProjection extends React.Component {

    getProjectedRow(data, index) {
        return <tr>
            <td>{data[index].Symbol}</td>
            <td>{data[index].strikePrice}</td>
            <td>{data[index].totalCEQty}</td>
            <td>{data[index].totalPEQty}</td>
            <td>{data[index].totalCEPNL}</td>
            <td>{data[index].totalPEPNL}</td>
            <td>{data[index].totalPNL}</td>
        </tr>
    }

    displayProjectedData(rows) {
        return <Table striped bordered hover>
            <thead>
                <tr>
                    <td>Symbol</td>
                    <td>Strike Price</td>
                    <td>Total CE Qty</td>
                    <td>Total PE Qty</td>
                    <td>Final CE PNL</td>
                    <td>Final PE PNL</td>
                    <td>Total PNL</td>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>;
    }

    displayProjectedHeader() {
        return <Table striped hover>
            <thead>
                <tr>
                    <td> <h1> Projected Data </h1></td>
                </tr>
            </thead>
        </Table>;
    }

    render() {
        const projectedData = SASConstants.projectedData;
        const projectedRows = [];
        for (let index = 0; index < projectedData.length; index++) {
            projectedRows.push(this.getProjectedRow(projectedData, index));
        }
        return (

            <div style={{ padding: '5px' }}>

                {this.displayProjectedHeader()}

                {this.displayProjectedData(projectedRows)}

            </div>
        )
    }

}

export default SASProjection;