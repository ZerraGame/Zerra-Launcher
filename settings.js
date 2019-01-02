module.exports = {
    getSettings: function() {
        'use strict';

        // Get our variables ready
        const fs = require('fs');
        const path = 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Launcher/Settings/settings.json';

        // Read the settings file @path. If that doesn't exist, then read the default settings.json.
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