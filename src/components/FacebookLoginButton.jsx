import React, { Component } from 'react';

const electron = window.require('electron');

class FacebookLoginButton extends Component
{
    constructor(props) {
        super(props);
    }

    handleOnClick() {
        electron.ipcRenderer.send('fb-auth-request');
    }

    render() {
        return (
            <button className="Facebook-Login-Button" onClick={this.handleOnClick}>Login with Facebook</button>
        );
    }
}

export default FacebookLoginButton;