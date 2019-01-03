const request = require('request');
const fs = require('fs');
const path = require('path');

request('http://216.53.217.165:8080/FetchGameVersions', { json: true }, (err, res, body) => {

    if (err) {
        return console.log(err);
    }

    var versionList = body.toString().split(',');

    var i;
    for (i = 0; i < versionList.length; i++) {
        var temp = versionList[i].replace('.jar', '').replace('-', ' ');
        var version = temp.replace('Zerra ', '');
        document.getElementById("VersionList").innerHTML += '<a class="dropdown-item" id="' + version + '" href="#" onclick="newInstanceVersion(this)">' + temp + '</a>';
    }
});
