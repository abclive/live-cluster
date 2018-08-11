import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../withRoot';
import { Typography, Grid, Paper } from '@material-ui/core';
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
        this.handleStartupEnd = this.handleStartupEnd.bind(this);
    }

    handleStartupEnd(plateform, plateformInfo) {
        this.props.onSetup(plateform, plateformInfo);
    }

    render() {
        return (
            <div className={this.props.classes.panel}>
                <Grid container spacing={24} alignItems="center" justify="center">
                    <Grid item xs={10}>
                        <Paper className={this.props.classes.inner}>
                            <Typography className={this.props.classes.textCenter} variant="headline" gutterBottom>Connect to Live Cluster</Typography>
                            <StartupSequence onSequenceEnd={this.handleStartupEnd}/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

LandingPanel.propTypes = {
    onSetup: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(LandingPanel));