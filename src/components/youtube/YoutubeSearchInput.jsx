import React, { Component } from 'react';
import withRoot from '../../withRoot';
import { withStyles } from '@material-ui/core/styles';
import { Button, FormControl, Input, InputLabel, FormHelperText } from '@material-ui/core';

const electron = window.require('electron');

const styles = theme => ({
    root: {
        
    },
    formControl: {
        width: '300px'
    },
    selectBtn: {
        marginLeft: '10px'
    }
});

class YoutubeSearchInput extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            keywords: '',
            resultCount: -1
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        electron.ipcRenderer.on('yt-keywords-count', (e, keywordsCount) => {
            if (this.state.keywords.length > 3) {
                this.setState({
                    resultCount: keywordsCount
                });
            }
        });
    }

    handleOnSubmit(event) {

    }

    handleChange(event) {
        let newState = {
            keywords: event.target.value
        }
        if (event.target.value.length > 3) {
            electron.ipcRenderer.send('yt-count-keywords', event.target.value);
        } else {
            newState.resultCount = -1
        }
        this.setState(newState);
    }

    render() {
        const resultCount = (this.state.resultCount < 0) ? '' : this.state.resultCount + ' live videos matching your search';

        return (
            <div className={this.props.classes.root}>
                <FormControl className={this.props.classes.formControl}>
                    <InputLabel htmlFor="keywords">Event Keywords</InputLabel>
                    <Input id="keywords" value={this.state.keywords} onChange={this.handleChange} />
                    <FormHelperText id="keywords-helper-text">{resultCount}</FormHelperText>
                </FormControl>
                <Button className={this.props.classes.selectBtn} variant="contained" size="small" color="primary" disabled={!(this.state.keywords.length > 3)}>Select</Button>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(YoutubeSearchInput))