module.exports = {
    getSettings: function() {
        'use strict';

        // Read our playfab settings JSON file
        const fs = require('fs');
        const path = 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Launcher/Settings/settings.json';

        if (fs.existsSync(path)) {
            let settingsFile = fs.readFileSync(path);
            let settingsContents = JSON.parse(settingsFile);

            return settingsContents;
        } else {

            let defaultFile = fs.readFileSync('defaults/settings.json');
            let defaultContents = JSON.parse(defaultFile);

            return defaultContents;
        }
    }
}