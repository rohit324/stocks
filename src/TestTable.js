
import React from 'react';
import Table from 'react-bootstrap/Table';
import Positions from './Positions';
import Constants from './Constants';
import Orders from './Orders';
class TestTable extends React.Component {

  

  defaultFilter = 'MAY';
  accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFja2xpc3Rfa2V5IjoiUkExMDg6WW5USXZWMUU3dGtjUUZuaEhTTjh4QSIsImNsaWVudF9pZCI6IlJBMTA4IiwiY2xpZW50X3Rva2VuIjoiY25XckpTajh6dXJBejhuRnVpc25wUSIsImRldmljZSI6IndlYiIsImV4cCI6MTY3ODA3NDQzNzAxMH0.u6JHL6HmFhNw6pZz0ESH9lczQWxyf8OULgn63MLsU1g`

  state = {
    data: {},
    filter: this.defaultFilter,
    projectedData: {},
    startRange: 16000,
    endRange: 19000,
    sampleValue: 'Sample value'
  }

  tableSource() {
    console.log('calling tableSource  ');
    return Positions.getFormattedData()
  }

  tableSourceFiltered(filter) {
    const val = Positions.getFilteredData(filter);
    return val;
  }

  tableProjectedFiltered(filter, startRange, endRange) {
    const val = Positions.getFilteredData(filter);
    return Positions.getProjectedData(startRange, endRange, val)
  }


  handleClick = (event) => {
    console.log(event.target.value);
    this.setState({
      data: this.tableSourceFiltered(event.target.value),
      filter: event.target.value,
      startRange: this.state.startRange,
      endRange: this.state.endRange,
      projectedData: this.state.projectedData,
    });
  };

  setStartRange = (event) => {
    this.setState({
      data: this.state.data,
      filter: this.state.filter,
      startRange: event.target.value,
      endRange: this.state.endRange,
      projectedData: this.state.projectedData,
    });
  }

  setEndRange = (event) => {
    this.setState({
      data: this.state.data,
      filter: this.state.filter,
      projectedData: this.state.projectedData,
      startRange: this.state.startRange,
      endRange: event.target.value
    });
  }

  displayPNLData = (event) => {
    console.log(this.state);
    if (this.state.startRange === 0 || this.state.endRange === 0 || this.state.endRange < this.state.startRange) {
      alert('End Range should be greater than start range');
      return;
    }

    const projectedData = this.tableProjectedFiltered(this.state.filter, this.state.startRange, this.state.endRange);
    console.log(projectedData);
    this.setState({
      data: this.state.data,
      filter: this.state.filter,
      projectedData: projectedData,
      startRange: this.state.startRange,
      endRange: this.state.endRange
    });
  };

  deleteRow = (event) => {
    console.log(event.target.name);
    Positions.removeData(event.target.name);
    this.setState({
      data: this.tableSourceFiltered(this.state.filter),
      filter: this.state.filter,
      startRange: this.state.startRange,
      endRange: this.state.endRange,
      projectedData: this.state.projectedData,
    });
  }

  render() {
    const data = this.state.data;
    const positionRows = [];
    for (let index = 0; index < data.length; index++) {
      positionRows.push(this.getDisplayRow(data, index));
    }
    if (data && data.length > 0) {
      positionRows.push(this.getTotalDisplayRow(data));
    }
    positionRows.push(Positions)
    const projectedData = this.state.projectedData;
    const projectedRows = [];
    for (let index = 0; index < projectedData.length; index++) {
      projectedRows.push(this.getProjectedRow(projectedData, index));
    }
    return (
      <div style={{ padding: '50px' }}>

        {this.displayStatusHeader()}

        {this.displaySearchBar()}

        {this.displayPositionsTable(positionRows)}

        {this.displayProjectedHeader()}

        {this.displayProjectedData(projectedRows)}

      </div>
    )
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

  displayPositionsTable(rows) {
    return <Table striped bordered hover>
      <thead>

        <tr>
          <td>Symbol</td>
          <td>Product</td>
          <td>Qty</td>
          <td>Sell Value</td>
          <td>Buy Value</td>
          <td>LTP</td>
          <td>PNL</td>
          <td>Buy Avg</td>
          <td>Sell Avg</td>
          <td>Remove</td>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Table>;
  }

  saveAccessToken = (event) => {
    Constants.accessToken = event.target.value;
  }

  displayStatusHeader() {
    return <Table striped bordered hover>
      <tbody>
        <tr>
          <td>{this.state.status}</td>
          <td>{this.state.message}</td>
        </tr>
      </tbody>
    </Table>
  }

  displaySearchBar() {
    return <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Access Token</td>
          <td><input name="search" onChange={this.saveAccessToken} value={Constants.accessToken} /></td>
          <td>{this.state.sampleValue}</td>
          <td><input name="search" onChange={this.handleClick} value={this.state.filter} /></td>
          <td>Enter Start Range</td>
          <td><input name="startRange" onChange={this.setStartRange} value={this.state.startRange} /></td>
          <td>Enter End Range</td>
          <td><input name="endRange" onChange={this.setEndRange} value={this.state.endRange} /></td>
          <td><button name="endRange" onClick={this.displayPNLData} >Show Projections</button></td>
          <td><button name="sampleFetch" onClick={this.getOpenPositions} >Sample fetch</button></td>
        </tr>
      </tbody>
    </Table>;
  }



  fetchSample = (event) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Fetch POST Request Example' })
    };
    fetch('https://reqres.in/api/articles', requestOptions)
      .then(response => response.json())
      .then(data => alert(data));
  }

  getOpenPositions = (event) => {
    if (!Constants.accessToken || Constants.accessToken.length === 0) {
      alert('token is mandatory');
      return;
    }
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'X-Authorization-Token': Constants.accessToken }
    };
    fetch('https://alpha.sasonline.in/api/v1/positions?client_id=RA108&type=historical', requestOptions)
      .then(response => response.json())
      .then(data => {
        Positions.setData(data);
        this.setState({
          data: Positions.getFilteredData(this.state.filter),
          filter: this.state.filter,
          projectedData: this.state.projectedData,
          startRange: this.state.startRange,
          endRange: this.state.endRange,
          sampleValue: data.status
        });
      });
  }

  sell = (data) => {
    const order = Orders.getSampleOrder;
    order.instrument_token = data.token+'';
    order.price = data.ltp;
    order.order_side = 'SELL';
    if (data.trading_symbol.startsWith('BANK')) {
      order.quantity = 25;
    } else {
      order.quantity = 50;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Authorization-Token': Constants.accessToken },
      body: JSON.stringify(order)
    };
    fetch('https://alpha.sasonline.in/api/v1/orders', requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: this.state.data,
          filter: this.state.filter,
          projectedData: this.state.projectedData,
          startRange: this.state.startRange,
          endRange: this.state.endRange,
          sampleValue: data.status,
          status:data.status,
          message:data.message
        });
      });

  }

  buy = (data) => {
    const order = Orders.getSampleOrder;
    order.instrument_token = data.token+'';
    order.price = data.ltp;
    order.order_side = 'BUY';
    if (data.trading_symbol.startsWith('BANK')) {
      order.quantity = 25;
    } else {
      order.quantity = 50;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Authorization-Token': Constants.accessToken },
      body: JSON.stringify(order)
    };
    fetch('https://alpha.sasonline.in/api/v1/orders', requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: this.state.data,
          filter: this.state.filter,
          projectedData: this.state.projectedData,
          startRange: this.state.startRange,
          endRange: this.state.endRange,
          sampleValue: data.status,
          status:data.status,
          message:data.message
        });
      });


  }

  getDisplayRow(data, index) {
    return <tr>
      <td>{data[index].trading_symbol}</td>
      <td>{data[index].symbol}</td>
      <td>{data[index].net_quantity}</td>
      <td>{data[index].actual_cf_sell_amount}</td>
      <td>{data[index].actual_cf_buy_amount}</td>
      <td>{data[index].ltp}</td>
      <td>{Positions.getPNL(data[index])}</td>
      <td>{data[index]['actual_average_buy_price']}</td>
      <td>{data[index]['actual_average_sell_price']}</td>
      <td><button name={data[index].token} onClick={this.deleteRow}> Delete Row </button></td>
      <td><button name={data[index].token} onClick={() => this.sell(data[index])}> Sell </button></td>
      <td><button name={data[index]} onClick={() => this.buy(data[index])}> Buy </button></td>
    </tr>
  }

  getTotalDisplayRow(data) {
    const total = Positions.getTotalValues(data);
    return <tr>
      <td>{total.Symbol}</td>
      <td>{total.Product}</td>
      <td>{total.Qty}</td>
      <td>{total.sellValue}</td>
      <td>{total.buyValue}</td>
      <td>{total.ltp}</td>
      <td>{total.PNL}</td>
      <td>{total['Buy Avg']}</td>
      <td>{total['Sell Avg']}</td>

    </tr>
  }

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

}








export default TestTable;