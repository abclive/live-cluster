import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../withRoot';
import { Typography, Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FacebookLoginButton from '../facebook/FacebookLoginButton';
import FacebookEventList from '../facebook/FacebookEventList';
import YoutubeLoginButton from '../youtube/YoutubeLoginButton';
import YoutubeSearchInput from '../youtube/YoutubeSearchInput';

const electron = window.require('electron');

const styles = theme => ({

});

class StartupSequence extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            authName: '',
            authType: ''
        };
        this.steps = ['Authenticate with Facebook or Youtube', 'Configure the cluster selection'];

        this.handleFacebookEventSelection = this.handleFacebookEventSelection.bind(this);
        this.handleYoutubeSearch = this.handleYoutubeSearch.bind(this);
    }

    componentDidMount() {
        electron.ipcRenderer.on('fb-auth-success', (e, user) => {
            this.setState({
                authType: 'fb',
                activeStep: this.state.activeStep + 1,
                authName: user.name
            })
        });
        electron.ipcRenderer.on('yt-auth-success', (e, user) => {
            this.setState({
                authType: 'yt',
                activeStep: this.state.activeStep + 1,
                authName: user.title
            })
        });
    }

    handleFacebookEventSelection(eventId) {
        this.props.onSequenceEnd('fb', eventId);
    }

    handleYoutubeSearch(keywords) {
        this.props.onSequenceEnd('yt', keywords);
    }

    renderClusterSelection() {
        if (this.state.authType == 'fb') {
            return (
                <div>
                    <Typography variant="body2">Logged in as {this.state.authName}</Typography>
                    <Typography gutterBottom>Please select an event to fetch the live videos from</Typography>
                    <FacebookEventList onSelection={this.handleFacebookEventSelection}/>
                </div>
            );
        } else {
            return (
                <div>
                    <Typography variant="body2">Logged in as {this.state.authName}</Typography>
                    <Typography gutterBottom>Please type the event name to search on Youtube</Typography>
                    <YoutubeSearchInput onSubmit={this.handleYoutubeSearch}/>
                </div>
            );
        }
    }

    getStepContent(index) {
        switch(index) {
            case 0: {
                return (
                    <div>
                        <Typography gutterBottom>In order to use Live Cluster you need to login to a Facebook or Youtube account</Typography>
                        <FacebookLoginButton/>
                        <div style={{marginLeft: '15px', display: 'inline-block'}}>
                            <YoutubeLoginButton/>
                        </div>
                    </div>
                );
            }
            case 1: {
                return this.renderClusterSelection();
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

StartupSequence.propTypes = {
    onSequenceEnd: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(StartupSequence));