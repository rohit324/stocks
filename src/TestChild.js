import React from 'react';

class TestChild extends React.Component {

    render() {
        const displayName = this.props.displayName;
        return (
          <div style={{ padding: '50px' }}>
            <h1> {displayName}</h1>
          </div>
        )
      }

}

export default TestChild;