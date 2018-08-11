const {ipcMain, BrowserWindow, mainWindow} = require('electron');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

let config = {
    CLIENT_ID: '307982401448-mt0b7lfabtkops2jple0ndt3n0iirf19.apps.googleusercontent.com',
    CLIENT_SECRET: 'oZr1_BmnydFJo1VGacq3gjwL',
    REDIRECT_URI: 'urn:ietf:wg:oauth:2.0:oob',
    SCOPES: 'https://www.googleapis.com/auth/youtube',
    TOKEN_DIR: './.credentials/'
};
config.TOKEN_PATH = config.TOKEN_DIR + 'yt_token.json'

class YoutubeController {

    constructor() {
        this.oAuthClient = null;
        this.setupEvents();
    }
 
    setupEvents() {
        ipcMain.on('yt-auth-request', this.onAuthRequest.bind(this));
        ipcMain.on('yt-count-keywords', this.onCountKeywords.bind(this));
    }

    onAuthRequest(event) {
        let eventSender = event.sender;
        this.authorize((oauth2Client) => {
            this.oAuthClient = oauth2Client;
            this.getChannelInfo((userInfo) => {
                eventSender.send('yt-auth-success', userInfo);
            });
        });
    }

    onCountKeywords(event, keywords) {
        let eventSender = event.sender;
        this.countResultForKeywords(keywords, (result) => {
            eventSender.send('yt-keywords-count', result);
        });
    }

    getChannelInfo(callback) {
        const service = google.youtube('v3');
        service.channels.list({
            auth: this.oAuthClient,
            part: 'snippet',
            mine: true
        }, (err, response) => {
            if (err) throw err;
            if (response.status === 200 && response.data.pageInfo.totalResults > 0) {
                callback(response.data.items[0].snippet);
            }
        });
    }

    countResultForKeywords(keywords, callback) {
        const service = google.youtube('v3');
        service.search.list({
            auth: this.oAuthClient,
            part: 'id',
            q: keywords,
            type: 'video',
            eventType: 'live',
            maxResults: 50,
            safeSearch: 'none'
        }, (err, response) => {
            if (err) throw err;
            if (response.status === 200) {
                callback(response.data.pageInfo.totalResults);
            }
        });
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * 
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(callback) {
        const oauth2Client = new OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URI);

        // Check if we have previously stored a token.
        fs.readFile(config.TOKEN_PATH, (err, token) => {
            if (err) {
                this.getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    getNewToken(oauth2Client, callback) {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: config.SCOPES
        });

        let authWindow = new BrowserWindow({
            width: 640, height: 800, show: false,
            parent: mainWindow, modal: true, webPreferences: {nodeIntegration:false}
        });

        authWindow.loadURL(authUrl);
        authWindow.show();
        authWindow.webContents.on('did-get-response-details', (event, status, newUrl) => {
            console.log(newUrl);
            const rawCode = /approvalCode=([^&]*)/.exec(newUrl) || null;
            const accessToken = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
            const error = /\?error=(.+)$/.exec(newUrl);

            if (accessToken) {
                authWindow.close();
                oauth2Client.getToken(decodeURIComponent(accessToken), (err, token) => {
                    if (err) {
                        console.log('Error while trying to retrieve access token', err);
                        return;
                    }
                    oauth2Client.credentials = token;
                    this.storeToken(token);
                    callback(oauth2Client);
                });
            }
        });

        console.log('Authorize this app by visiting this url: ', authUrl);
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    storeToken(token) {
        try {
            fs.mkdirSync(config.TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(config.TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) throw err;
            console.log('Token stored to ' + config.TOKEN_PATH);
        });
        console.log('Token stored to ' + config.TOKEN_PATH);
    }
}

module.exports = YoutubeController;