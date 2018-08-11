import React, { Component } from 'react';
import withRoot from '../withRoot';
import LandingPanel from './panels/LandingPanel';
import StudioPanel from './panels/StudioPanel';

class App extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            plateform: '',
            plateformInfo: null,
            currentPanel: 'landing'
        };

        this.handleSetupEnd = this.handleSetupEnd.bind(this);
    }

    handleSetupEnd(plateform, plateformInfo) {
        this.setState({
            currentPanel: 'studio',
            plateform: plateform,
            plateformInfo: plateformInfo
        });
    }

    renderPanel() {
        if (this.state.currentPanel == 'studio')
            return <StudioPanel plateform={this.state.plateform} plateformInfo={this.state.plateformInfo}/>;
        return <LandingPanel onSetup={this.handleSetupEnd}/>
    }

    render() {
        return (
            <div className="App">
                {this.renderPanel()}
            </div>
        );
    }
}

export default withRoot(App);
