import React, { Component } from 'react';
import withRoot from '../withRoot';
import LandingPanel from './panels/LandingPanel';

class App extends Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <LandingPanel/>
            </div>
        );
    }
}

export default withRoot(App);
