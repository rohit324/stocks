import React from 'react';
class Shopping extends React.Component {

    render() {
        return (
            <div className = "shopping-list">
                <h1> Shopping List for {this.props.name} </h1>
                <ul>
                    <li>Insta</li>
                    <li>Whats app</li>
                    <li>Tic Toc</li>
                </ul>
            </div>
        )
    }
}
 

export default Shopping;