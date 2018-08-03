const {ipcMain, BrowserWindow, mainWindow} = require('electron');
const graph = require('fbgraph');

const config = {
    client_id: '236517973719287',
    redirect_uri: 'https://www.facebook.com/connect/login_success.html'
};

class FacebookController {

    constructor() {
        this.currentUser = null;
        this.setupEvents();
    }

    setupEvents() {
        ipcMain.on('fb-auth-request', this.onAuthRequest);
        ipcMain.on('fb-list-events', this.onListEvents);        
    }

    onListEvents(event) {
        let eventSender = event.sender;
        graph.get('me/events', (err, res) => {
            eventSender.send('fb-event-list', res);
        });
    }

    onAuthRequest(event) {
        let eventSender = event.sender;
        let authUrl = graph.getOauthUrl({
            "client_id":     config.client_id,
            "redirect_uri":  config.redirect_uri,
            "response_type": 'token',
            "scope": 'user_events'
        });
        let authWindow = new BrowserWindow({
            width: 640, height: 800, show: false,
            parent: mainWindow, modal: true, webPreferences: {nodeIntegration:false}
        });

        authWindow.loadURL(authUrl);
        authWindow.show();
        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            const rawCode = /access_token=([^&]*)/.exec(newUrl) || null;
            const accessToken = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
            const error = /\?error=(.+)$/.exec(newUrl);

            if (accessToken) {
                graph.setAccessToken(accessToken);
                graph.get('me', (err, res) => {
                    this.currentUser = res;
                    eventSender.send('fb-auth-success', res);
                    authWindow.close();
                });
            }
        });
    }
}

module.exports = FacebookController;
