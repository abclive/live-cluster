import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../withRoot';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, Icon, Button } from '@material-ui/core';

const electron = window.require('electron');

const styles = theme => ({
    root: {
        paddingTop: '20px'
    },
    listContainer: {
        maxHeight: '400px',
        overflow: 'auto'
    },
    calIcon: {
        marginRight: '10px',
        marginBottom: '-5px'
    },
    calText: {
    }
});

class FacebookEventList extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
            eventList: {}
        };
    }

    componentDidMount() {
        electron.ipcRenderer.send('fb-list-events');
        electron.ipcRenderer.on('fb-event-list', this.onEventsList.bind(this));
    }

    onEventsList(e, eventList) {
        this.setState({
            status: 'loaded',
            eventList: eventList.data
        });
    }

    render() {
        if (this.state.status == 'loading') {
            return (
                <CircularProgress/>
            );
        } else if (this.state.status == 'loaded') {
            return (
                <div className={this.props.classes.root}>
                    <Typography variant="body2">
                        <Icon className={this.props.classes.calIcon}>calendar_today</Icon>
                        <span className={this.props.classes.calText}>Events linked to your account</span>
                    </Typography>
                    <List className={this.props.classes.listContainer} component="nav">
                        {this.state.eventList.map((eventInfo, key) => {
                            return(
                                <ListItem key={key} button>
                                    <ListItemText primary={eventInfo.name} secondary={eventInfo.description.substr(0, 100)}/>
                                    <ListItemSecondaryAction>
                                        <Button variant="flat" color="primary" onClick={() => {this.props.onSelection(eventInfo.id)}}>Select</Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
            );
        }
        return null;
    }
}

FacebookEventList.propTypes = {
    onSelection: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(FacebookEventList));