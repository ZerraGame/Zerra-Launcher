window.jQuery = window.$ = require('jquery');

const fs = require('fs');

var path = 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Launcher/Settings/settings.json';

const form = document.getElementById('settings');

//Automatically set the values of the form according to the settings, if they exist.
if (fs.existsSync(path)) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        var jsonSettings = JSON.parse(data);

        var elements = form.querySelectorAll("input, select, textarea");

        for (var i = 0; i < elements.length; i++) {

            var element = elements[i];

            var value = jsonSettings[element.name];

            if (element.type === 'checkbox') {
                if (value == true) {
                    element.checked = true;
                    console.log('set checkbox with name ' + element.name + ' to true.');
                } else {
                    element.checked = false;
                    console.log('set checkbox with name ' + element.name + ' to false.');
                }
            } else if (element.type === 'radio') {
                if (jsonSettings[element.name] == element.id) {
                    element.checked = true;
                    console.log('set checkbox with name ' + element.name + ' to true.');
                }
            } else if (element.type === 'text') {
                element.value = value;
            }
        }
        console.log(jsonSettings);
    });
} else {
    const default_settings = require('./default_settings.js');

    var jsonSettings = default_settings.getDefaultSettings();

    var elements = form.querySelectorAll("input, select, textarea");

    for (var i = 0; i < elements.length; i++) {

        var element = elements[i];

        var value = jsonSettings[element.name];

        if (element.type === 'checkbox') {
            if (value == true) {
                element.checked = true;
                console.log('set checkbox with name ' + element.name + ' to true.');
            } else {
                element.checked = false;
                console.log('set checkbox with name ' + element.name + ' to false.');
            }
        } else if (element.type === 'radio') {
            if (jsonSettings[element.name] == element.id) {
                element.checked = true;
                console.log('set checkbox with name ' + element.name + ' to true.');
            }
        } else if (element.type === 'text') {
            element.value = value;
        }
    }
    console.log(jsonSettings);
}


//Save the settings of the form once the user presses the save button.
function saveSettings() {

    const data = toJSONString(form);

    //Writing to the settings file.

    if (fs.existsSync(path)) {
        fs.writeFileSync(path, data, { flag: 'w' }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('The file was saved!');
            }
        });
    } else {
        fs.writeFileSync(path, data, { flag: 'wx' }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('The file was saved!');
            }
        });
    }

    const remote = require('electron').remote;
    var window = remote.getCurrentWindow();
    window.close();
}

//Convert the form to a JSON format.
function toJSONString(form) {

    var obj = {};

    var elements = form.querySelectorAll("input, select, textarea");

    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name;

        var value = null;
        if (element.type === 'checkbox') {
            if (element.checked) {
                value = true;
            } else {
                value = false;
            }
            //We want the bandwidth to be a number, not a string.
        } else if (element.name == "MaximumBandwidth" || element.name == "QueueSize") {
            value = parseInt(element.value, 10);
        } else if (element.type === 'text') {
            value = element.value;
        } else if (element.type === "radio") {
            //Radio buttons are wonky to work with, so this check system makes them less of a pain to write to JSON.
            if (element.checked == true) {
                value = element.value;
                if (name) {
                    obj[name] = value;
                }
            }
        } else {
            value = element.value;
        }

        //Exclude radio buttons.
        if (element.type !== 'radio') {
            if (name) {
                obj[name] = value;
            }
        }

    }

    return JSON.stringify(obj);
}
