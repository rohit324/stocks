import React from 'react';
import SASConstants from './SASConstants';
import Orders from './Orders';
import Positions from './Positions';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import cookie from "react-cookie";
class SASPositions extends React.Component {

    sell = (data) => {
        const order = Orders.getSampleOrder;
        order.instrument_token = data.token + '';
        order.price = data.ltp;
        order.order_side = 'SELL';
        if (data.trading_symbol.startsWith('BANK')) {
            order.quantity = 25;
        } else {
            order.quantity = 50;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Authorization-Token': SASConstants.accessToken },
            body: JSON.stringify(order)
        };
        fetch('https://alpha.sasonline.in/api/v1/orders', requestOptions)
            .then(response => response.json())
            .then(data => {
                SASConstants.processResponse(data);
                this.props.rerenderParentCallback();
            });
    }

   

    buy = (data) => {
        const order = Orders.getSampleOrder;
        order.instrument_token = data.token + '';
        order.price = data.ltp;
        order.order_side = 'BUY';
        if (data.trading_symbol.startsWith('BANK')) {
            order.quantity = 25;
        } else {
            order.quantity = 50;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Authorization-Token': SASConstants.accessToken },
            body: JSON.stringify(order)
        };
        fetch('https://alpha.sasonline.in/api/v1/orders', requestOptions)
            .then(response => response.json())
            .then(data => {
                SASConstants.processResponse(data);
                this.props.rerenderParentCallback();
            });


    }

    deleteRow = (event) => {
        console.log(event.target.name);
        SASConstants.currentPositionsData = Positions.removePosition(SASConstants.currentPositionsData, event.target.name);
        this.forceUpdate();
    }

    comments = (event) => {
        console.log(event);
    }

    displayPositionsHeader() {
        return <Table striped hover>
            <thead>
                <tr>
                    <td> <h1> Positions Data </h1></td>
                </tr>
            </thead>
        </Table>;
    }

    getTotalDisplayRow(data) {
        const total = Positions.getTotalValues(data);
        return <tr>
            <td>{total.Symbol}</td>
            <td>{total.Product}</td>
            <td>{total.Qty}</td>
            <td>{total.CEValue}</td>
            <td>{total.PEValue}</td>
            <td>{total.currentValue}</td>
            <td>{total.ltp}</td>
            <td>{total.PNL}</td>
            <td>{total.PNL}</td>
            <td>{total.PNL}</td>
        </tr>
    }



    getDisplayRow(data, index, instance) {
        return <tr>
            <td>{data[index].trading_symbol}</td>
            <td>{data[index].symbol}</td>
            <td>{data[index].net_quantity}</td>
            <td>{Positions.getCEValue(data[index])}</td>
            <td>{Positions.getPEValue(data[index])}</td>
            <td>{Positions.getCurrentValue(data[index])}</td>
            <td>{data[index].ltp}</td>
            <td>{Positions.getPNL(data[index])}</td>
            <td><input name="comments" onChange={this.comments}/></td>
            <td>{Positions.getBuyPrice(data[index])}</td>
            <td>{Positions.getSellPrice(data[index])}</td>
            <td><Button name={data[index].token} onClick={this.deleteRow} variant="outline-danger" size='sm'> Delete</Button></td>
            <td><Button name={data[index].token} onClick={() => this.sell(data[index])} variant="outline-info" size='sm'> Sell </Button></td>
            <td><Button name={data[index]} onClick={() => this.buy(data[index])} variant="outline-info" size='sm'> Buy </Button></td>
        </tr>
    }

    displayPositionsTable(rows) {
        return <Table striped bordered hover>
            <thead>

                <tr>
                    <td>Symbol</td>
                    <td>Product</td>
                    <td>Qty</td>
                    <td>CE Value</td>
                    <td>PE Value</td>
                    <td>Current Value</td>
                    <td>LTP</td>
                    <td>PNL</td>
                    <td>Comments</td>
                    <td>Buy Price</td>
                    <td>Sell Price</td>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>;
    }

    render() {
        const data = SASConstants.currentPositionsData;
        const positionRows = [];
        for (let index = 0; index < data.length; index++) {
            positionRows.push(this.getDisplayRow(data, index, this));
        }
        if (data && data.length > 0) {
            positionRows.push(this.getTotalDisplayRow(data));
        }
        positionRows.push(Positions)
        return (

            <div style={{ padding: '5px' }}>
                {this.displayPositionsHeader()}
                {this.displayPositionsTable(positionRows)}

            </div>
        )
    }

}

export default SASPositions;