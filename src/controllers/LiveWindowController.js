const {ipcMain, BrowserWindow, mainWindow} = require('electron');
const path = require('path');
const url = require('url');

class LiveWindowController {

    constructor(env = 'DEV') {
        this.env = env;
        this.plateform = 'yt';
        this.liveWindow = null;
        this.setupEvents();
    }

    displayWindow() {
        this.liveWindow = new BrowserWindow({
            width: 1280, height: 720, show: false,
            parent: mainWindow, modal: false, webPreferences: {webSecurity: false}
        });
        const windowUrl = (this.env == 'DEV') ? 'http://localhost:3000?live-window' : url.format({
            pathname: path.join(__dirname, '/../../build/index.html'),
            protocol: 'file:',
            slashes: true,
            search: '?live-window' 
        });
        this.liveWindow.loadURL(windowUrl);
        this.liveWindow.setMenuBarVisibility(false);
        this.liveWindow.setFullScreenable(true);
        this.liveWindow.show();
        this.liveWindow.on('close', () => {
            this.liveWindow = null;
        });
    }

    setupEvents() {
        ipcMain.on('display-live-monitor', this.onDisplayMonitor.bind(this));
        ipcMain.on('cue-video', this.onCueVideo.bind(this));
    }

    onCueVideo(event, videoInfo) {
        if (!this.liveWindow) {
            this.displayWindow();
        }
        this.liveWindow.webContents.send('video-cued', videoInfo.id);
    }

    onDisplayMonitor(event) {
        this.displayWindow();
    }
}

module.exports = LiveWindowController;