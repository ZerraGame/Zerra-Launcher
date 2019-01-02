const default_settings = require('./default_settings.js');

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
            return default_settings.getDefaultSettings();
        }
    }
}