import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { Typography, Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FacebookLoginButton from '../FacebookLoginButton';
import FacebookEventList from '../FacebookEventList';
import { setAppSecret } from '../../../node_modules/fbgraph/lib/graph';

const electron = window.require('electron');

const styles = theme => ({

});

class StartupSequence extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            authName: ''
        };
        this.steps = ['Authenticate to Facebook', 'Select an event'];
    }

    componentDidMount() {
        electron.ipcRenderer.on('fb-auth-success', (e, user) => {
            this.setState({
                activeStep: this.state.activeStep + 1,
                authName: user.name
            })
        });
    }

    getStepContent(index) {
        switch(index) {
            case 0: {
                return (
                    <div>
                        <Typography gutterBottom>In order to use Live Cluster you need to login to a Facebook account</Typography>
                        <FacebookLoginButton/>
                    </div>
                );
            }
            case 1: {
                return (
                    <div>
                        <Typography variant="body2">Logged in as {this.state.authName}</Typography>
                        <Typography gutterBottom>Please select an event to fetch the live videos from</Typography>
                        <FacebookEventList/>
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <div className="Startup-Sequence">
                <Stepper activeStep={this.state.activeStep} orientation="vertical">
                    {this.steps.map((label, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>{this.getStepContent(index)}</StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(StartupSequence));