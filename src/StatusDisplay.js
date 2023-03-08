import React from 'react';
class StatusDisplay extends React.Component {

    state = {
        filter: this.defaultFilter,
        filter1: this.defaultFilter,
        filter2: this.defaultFilter,
        startRange: 16000,
        endRange: 19000,
    }

    search = (event) => {
        console.log(event.target.value);
        this.setState({
            data: this.tableSourceFiltered(event.target.value),
            filter: event.target.value,
            startRange: this.state.startRange,
            endRange: this.state.endRange,
            projectedData: this.state.projectedData,
        });
    };

    search1 = (event) => {
        console.log(event.target.value);
        this.setState({
            data: this.getFilteredDataWithData(this.state.data, event.target.value),
            filter: this.state.filter,
            startRange: this.state.startRange,
            endRange: this.state.endRange,
            projectedData: this.state.projectedData,
        });
    };

    search2 = (event) => {
        console.log(event.target.value);
        this.setState({
            data: this.getFilteredDataWithData(this.state.data, event.target.value),
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

    render() {
        const displayName = this.props.displayName;
        return (
            <div style={{ padding: '50px' }}>
                <h1> {displayName}</h1>
            </div>
        )
    }
}