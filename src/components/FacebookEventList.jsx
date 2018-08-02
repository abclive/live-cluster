import React, { Component } from 'react';

const electron = window.require('electron');

class FacebookEventList extends Component
{
    constructor(props) {
        super(props);
        this.state = {eventList: {}};
    }

    componentDidMount() {
        electron.ipcRenderer.on('fb-auth-success', (e, events) => {
            this.setState({eventList: events});
        });
    }

    render() {
        return (
            <pre>{JSON.stringify(this.state.eventList)}</pre>
        );
    }
}

export default FacebookEventList;