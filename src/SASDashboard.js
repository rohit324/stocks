import React from 'react';
import SASSearch from './SASSearch';
import SASPositions from './SASPositions';
import SASProjection from './SASProjection';
import Table from 'react-bootstrap/Table';
import SASConstants from './SASConstants';
class SASDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  rerenderParentCallback() {
    this.forceUpdate();
  }

  debug = (event) => {
    console.log(event.target.name);
    SASConstants.debug = event.target.value
    this.forceUpdate();
}


  displayStatusHeader() {
    return <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Status</td>
          <td>{SASConstants.status}</td>
          <td>Message</td>
          <td>{SASConstants.message}</td>
          <td>Enable Debug mode</td>
          <td><input name="debug" onChange={this.debug} value={SASConstants.debug} /></td>
        </tr>
      </tbody>
    </Table>
  }

  render() {

    return (
      <div style={{ padding: '50px' }}>
        {this.displayStatusHeader()}
        <SASSearch rerenderParentCallback={this.rerenderParentCallback}></SASSearch>
        <SASPositions rerenderParentCallback={this.rerenderParentCallback}></SASPositions>
        <SASProjection rerenderParentCallback={this.rerenderParentCallback}></SASProjection>
      </div>
    )
  }

}

export default SASDashboard;

