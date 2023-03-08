import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Constants from "./Constants";
import React from 'react';

class SearchDisplay extends React.Component {

static instance;



    static displaySearchBar(instance) {
        return <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Access Token</td>
              <td><input name="search" onChange={instance.saveAccessToken} value={Constants.accessToken} /></td>
              <td>{instance.state.sampleValue}</td>
              <td><input name="search" onChange={instance.handleClick} value={instance.state.filter} /></td>
              <td><input name="search2" onChange={instance.search1} /></td>
              <td><input name="search3" onChange={instance.search2} /></td>
              <td>Enter Start Range</td>
              <td><input name="startRange" onChange={instance.setStartRange} value={instance.state.startRange} /></td>
              <td>Enter End Range</td>
              <td><input name="endRange" onChange={instance.setEndRange} value={instance.state.endRange} /></td>
              <td><Button name="endRange" onClick={instance.displayPNLData} variant="secondary" size='md'>Show Projections</Button></td>
              <td><Button name="sampleFetch" onClick={instance.getOpenPositions} variant="secondary" size='md'>Sample fetch</Button></td>
            </tr>
          </tbody>
        </Table>;
      }
    

}

export default SearchDisplay;