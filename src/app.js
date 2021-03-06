const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

app.ENV_MODE = 'PROD';

const FacebookController = require('./controllers/FacebookController');
app.fbController = new FacebookController();
const YoutubeController = require('./controllers/YoutubeController');
app.ytController = new YoutubeController();
const LiveWindowController = require('./controllers/LiveWindowController');
app.liveWindowController = new LiveWindowController(app.ENV_MODE);

let mainWindow;

function createMainWindow () {
    mainWindow = new BrowserWindow({width: 1280, height: 720});

    // Change URL depending on dev/prod environment

    const windowUrl = (app.ENV_MODE == 'DEV') ? 'http://localhost:3000' : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(windowUrl);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // Clear Cache
    //electron.session.defaultSession.clearStorageData([], (data) => {})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow();
    }
});