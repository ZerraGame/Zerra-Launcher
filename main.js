const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

process.env.NODE_ENV = 'development';

let mainWindow;

//init some directories
const zerra_path = 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Launcher/';

var mkdirp = require('mkdirp');

mkdirp(zerra_path + "/Instances/", {});
mkdirp(zerra_path + "/Settings/", {});

// Listen for app to be ready
app.on('ready', function() {
    // Create new window
    mainWindow = new BrowserWindow({
        width: 850,
        height: 500,
        resizable: false,
        icon: path.join(__dirname, 'assets/res/icon.png')
    });

    mainWindow.setMenu(null);
    //TODO: make this work only in dev mode.
    //mainWindow.openDevTools();
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol:'file:',
        slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function() {
        app.quit();
    });

    /*
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
    */
});

/*
// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}
*/