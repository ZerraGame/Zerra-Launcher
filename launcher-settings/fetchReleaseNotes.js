const request = require('request');
var markdown = require("markdown").markdown;

var req = request('http://216.53.217.165:8080/latestLauncherNotes', function (error, response, body) {
    document.getElementById('v-pills-release').innerHTML = markdown.toHTML(body);
});
