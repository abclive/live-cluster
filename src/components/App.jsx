import React, { Component } from 'react';
import FacebookLoginButton from './FacebookLoginButton';
import FacebookEventList from './FacebookEventList';

class App extends Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <FacebookLoginButton/>
                <FacebookEventList/>
            </div>
        );
    }
}

export default App;
