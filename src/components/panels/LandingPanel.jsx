import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { Typography, Grid, Paper, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import StartupSequence from '../sequences/StartupSequence';

const styles = {
    panel: {
        margin: '50px 0'
    },
    inner: {
        padding: '50px',
    },
    textCenter: {
        textAlign: 'center'
    },
    loadingContainer: {
        paddingTop: '50px'
    },
    loadingText: {
        textAlign: 'center',
        paddingTop: '10px'
    }
}

class LandingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSetup: false
        };
        this.handleStartupEnd = this.handleStartupEnd.bind(this);
    }

    handleStartupEnd(eventId) {
        this.setState({
            isSetup: true
        });
    }

    renderContent() {
        if (!this.state.isSetup) {
            return <StartupSequence onSequenceEnd={this.handleStartupEnd}/>;
        }
        return (
            <Grid className={this.props.classes.loadingContainer} container alignItems="center" justify="center">
                <CircularProgress/>
                <Grid item xs="12">
                    <Typography className={this.props.classes.loadingText}>Loading event info...</Typography>
                </Grid>
            </Grid>
        );
    }

    render() {
        return (
            <div className={this.props.classes.panel}>
                <Grid container spacing={24} alignItems="center" justify="center">
                    <Grid item xs={10}>
                        <Paper className={this.props.classes.inner}>
                            <Typography className={this.props.classes.textCenter} variant="headline" gutterBottom>Connect to Live Cluster</Typography>
                            {this.renderContent()}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(LandingPanel));