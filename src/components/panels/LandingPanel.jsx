import React, { Component } from 'react';
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
    title: {
        textAlign: 'center'
    }
}

class LandingPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.classes.panel}>
                <Grid container spacing={24} alignItems="center" justify="center">
                    <Grid item xs={10}>
                        <Paper className={this.props.classes.inner}>
                            <Typography className={this.props.classes.title} variant="headline" gutterBottom>Connect to Live Cluster</Typography>
                            <StartupSequence/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(LandingPanel));