import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import SASConstants from './SASConstants';
import Positions from './Positions';
import SamplePositions from './SamplePositions';
class SASSearch extends React.Component {

    

    state = {
        filter: '',
        filter1: '',
        filter2: '',
        exludeFilter: '',
        exludeFilter1: '',
        exludeFilter2: '',
        startRange: 16000,
        endRange: 19000,
        accessToken: SASConstants.accessToken
    }

    getCurrentState() {
        return this.state;
    }


    filter = (event) => {
        const state = this.getCurrentState();
        state.filter = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };


    filter1 = (event) => {
        console.log(event.target.value)
        const state = this.getCurrentState();
        state.filter1 = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };

    filter2 = (event) => {
        const state = this.getCurrentState();
        state.filter2 = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };

    exludeFilter = (event) => {
        const state = this.getCurrentState();
        state.exludeFilter = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };

    exludeFilter1 = (event) => {
        const state = this.getCurrentState();
        state.exludeFilter1 = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };

    exludeFilter2 = (event) => {
        const state = this.getCurrentState();
        state.exludeFilter2 = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };

    exludeFilter3 = (event) => {
        const state = this.getCurrentState();
        state.exludeFilter3 = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };

    exludeFilter4 = (event) => {
        const state = this.getCurrentState();
        state.exludeFilter4 = event.target.value;
        this.setState(state);
        this.filterCurrentData();
        this.props.rerenderParentCallback();
    };

    exclude0Qty = (event) => {
        SASConstants.currentPositionsData = Positions.exclude0QtyValues(SASConstants.currentPositionsData);
        this.props.rerenderParentCallback();
    };


    setStartRange = (event) => {
        const state = this.getCurrentState();
        state.startRange = parseInt(event.target.value);
        this.setState(state);
    }

    setEndRange = (event) => {
        const state = this.getCurrentState();
        state.endRange = parseInt(event.target.value);
        this.setState(state);
        this.props.rerenderParentCallback();
    }

    saveAccessToken = (event) => {
        SASConstants.accessToken = event.target.value;
        const state = this.getCurrentState();
        state.accessToken = event.target.value;      
        this.setState(state);  
        this.props.rerenderParentCallback();    
    }

    displayProjectedPNL = (event) => {
        console.log(this.state);
        if (this.state.startRange === 0 || this.state.endRange === 0 || this.state.endRange < this.state.startRange) {
            alert('End Range should be greater than start range');
            return;
        }
        SASConstants.projectedData = Positions.getProjectedData(this.state.startRange, this.state.endRange, SASConstants.currentPositionsData)
        this.props.rerenderParentCallback();
    };

    filterCurrentData() {
        SASConstants.currentPositionsData = SASConstants.fetchedData;
        if (this.state.filter) {
            SASConstants.currentPositionsData = Positions.getFilteredDataWithData(SASConstants.fetchedData, this.state.filter);
        }
        if (this.state.filter1) {
            SASConstants.currentPositionsData = Positions.getFilteredDataWithData(SASConstants.currentPositionsData, this.state.filter1);
        }
        if (this.state.filter2) {
            SASConstants.currentPositionsData = Positions.getFilteredDataWithData(SASConstants.currentPositionsData, this.state.filter2);
        }
        if (this.state.exludeFilter) {
            SASConstants.currentPositionsData = Positions.getExcludeFilterDataWithData(SASConstants.currentPositionsData, this.state.exludeFilter);
        }
        if (this.state.exludeFilter1) {
            SASConstants.currentPositionsData = Positions.getExcludeFilterDataWithData(SASConstants.currentPositionsData, this.state.exludeFilter1);
        }
        if (this.state.exludeFilter2) {
            SASConstants.currentPositionsData = Positions.getExcludeFilterDataWithData(SASConstants.currentPositionsData, this.state.exludeFilter2);
        }
        if (this.state.exludeFilter3) {
            SASConstants.currentPositionsData = Positions.getExcludeFilterDataWithData(SASConstants.currentPositionsData, this.state.exludeFilter2);
        }
        if (this.state.exludeFilter4) {
            SASConstants.currentPositionsData = Positions.getExcludeFilterDataWithData(SASConstants.currentPositionsData, this.state.exludeFilter2);
        }
    }

    getOpenPositions = (event) => {
        SASConstants.status = 'Network call in progress.'
        SASConstants.message = 'Calling the server.'
        if (SASConstants.debug && SASConstants.debug.length > 0) {
            console.log('debug mode is enabled ');
            SASConstants.currentPositionsData = SamplePositions.getSampleData();
            SASConstants.fetchedData = SamplePositions.getSampleData();
            SASConstants.projectedData = SASConstants.currentPositionsData;
            console.log('returning sample postions.');
            this.props.rerenderParentCallback();
            return;
        }


        if (!SASConstants.accessToken || SASConstants.accessToken.length === 0) {
            alert('token is mandatory');
            return;
        }
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization-Token': SASConstants.accessToken }
        };
        fetch('https://alpha.sasonline.in/api/v1/positions?client_id=RA108&type=historical', requestOptions)
            .then(response => response.json())
            .then(data => {
                SASConstants.processResponse(data);
                if (data.status === 'error') {
                    alert(data.message);
                    return;
                }
                Positions.setData(data);
                SASConstants.fetchedData = data.data;
                SASConstants.currentPositionsData = data.data;
                SASConstants.projectedData = data.data;
                this.filterCurrentData();
                this.props.rerenderParentCallback();
            });
        this.props.rerenderParentCallback();
    }


    render() {
        return (
            <div>
                <Table striped bordered hover size='sm'>
                    <tbody>
                        <tr>
                            <td>Access Token</td>
                            <td colSpan={8}><textarea name="accessToken" style={{width:'100%'}} onChange={this.saveAccessToken} value={this.state.accessToken} /></td>
                        </tr>
                    </tbody>
                </Table>
                <Table striped bordered hover size='sm'>
                    <tbody>
                        <tr>
                            <td>Exclude Filters</td>
                            <td><input name="exludeFilter" onChange={this.exludeFilter} value={this.state.exludeFilter} /></td>
                            <td><input name="exludeFilter1" onChange={this.exludeFilter1} value={this.state.exludeFilter1} /></td>
                            <td><input name="exludeFilter2" onChange={this.exludeFilter2} value={this.state.exludeFilter2} /></td>
                            <td><input name="exludeFilter3" onChange={this.exludeFilter3} value={this.state.exludeFilter3} /></td>
                            <td><input name="exludeFilter4" onChange={this.exludeFilter4} value={this.state.exludeFilter4} /></td>
                            <td><Button onClick={this.exclude0Qty} > Exclude 0 Qty</Button></td>
                        </tr>
                    </tbody>
                </Table>
                <Table striped bordered hover size='sm'>
                    <tbody>
                        <tr>
                            <td>Include Filters</td>
                            <td><input name="filter" onChange={this.filter} value={this.state.filter} /></td>
                            <td><input name="filter1" onChange={this.filter1} value={this.state.filter1} /></td>
                            <td><input name="filter2" onChange={this.filter2} value={this.state.filter2} /></td>
                            <td>Enter Start Range</td>
                            <td><input name="startRange" onChange={this.setStartRange} value={this.state.startRange} /></td>
                            <td>Enter End Range</td>
                            <td><input name="endRange" onChange={this.setEndRange} value={this.state.endRange} /></td>
                            <td><Button name="endRange" onClick={this.displayProjectedPNL} variant="secondary" size='md'>Show Projections</Button></td>
                            <td><Button name="sampleFetch" onClick={this.getOpenPositions} variant="secondary" size='md'>Sample fetch</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default SASSearch;