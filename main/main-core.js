function openInstancesMenu() {

    const { dialog } = require('electron').remote;

    const electron = require('electron');
    const url = require('url');
    const path = require('path');

    const BrowserWindow = electron.remote.BrowserWindow;
    let instances = new BrowserWindow({

        height: 600,
        width: 1000,
        resizable: false,
    });

    instances.setMenu(null);

    // Load html into window
    instances.loadURL(url.format({
        pathname: path.join(__dirname, 'instances.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Garbage collection.
    instances.on('closed', function () {
        instances = null;
    });
}

function openSettings() {

    const electron = require('electron');
    const url = require('url');
    const path = require('path');

    const BrowserWindow = electron.remote.BrowserWindow;

    let settings = new BrowserWindow({
        width: 850,
        height: 500,
        resizable: false,
        frame: false,
        icon: path.join(__dirname, 'assets/res/icon.png')
    });
    
    settings.setMenu(null);

    // Load html into window
    settings.loadURL(url.format({
        pathname: path.join(__dirname, 'settings.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Garbage collection.
    settings.on('closed', function () {
        settings = null;
    });
}

window.jQuery = window.$ = require('jquery');

function manageModals() {
    $('#accountModal').modal('hide');
    $('#registerModal').modal('show');
}