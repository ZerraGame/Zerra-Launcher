const electron = require('electron');
const url = require('url');
const path = require('path');
const isDev = require('electron-is-dev');

const { app, BrowserWindow, Menu, globalShortcut } = electron;

let mainWindow;

//TODO: Make this path constant a global value, accessible from anywhere in the project.
//init some directories
const zerra_path = 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Launcher/';

var mkdirp = require('mkdirp');

mkdirp(zerra_path + "/Instances/", {});
mkdirp(zerra_path + "/Settings/", {});
mkdirp(zerra_path + "/Shared/", {});

// Listen for app to be ready
app.on('ready', function () {

    // Create new window
    mainWindow = new BrowserWindow({
        width: 850,
        height: 500,
        resizable: false,
        icon: path.join(__dirname, 'assets/res/icon.png')
    });

    mainWindow.setMenu(null);

    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Register keybindings. These keybindings are only to be used inside the development environment.
    if (isDev) {
        globalShortcut.register('CommandOrControl+R', () => {
            const window = require('electron').BrowserWindow;
            window.getFocusedWindow().reload();
        });

        globalShortcut.register('F5', () => {
            const window = require('electron').BrowserWindow;
            window.getFocusedWindow().reload();
        });

        globalShortcut.register('CommandOrControl+I', () => {
            const window = require('electron').BrowserWindow;
            window.getFocusedWindow().openDevTools();
        });
    }

    //Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });
});