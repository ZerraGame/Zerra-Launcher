$(document).ready(function () {
        Load();
});

function Load() {
        'use strict';

        // Read our playfab settings JSON file
        const fs = require('fs');

        let fileContents = fs.readFileSync('playfab_settings.json');  
        let jsonContents = JSON.parse(fileContents);  

        PlayFab.settings.titleId = jsonContents.database_key;

        // Check for button clicks;
        $("#login").click(function () {
                TryLogin();
        });
}

function TryLogin() {
        // Create a login request for PlayFab
        var loginRequest = {
                Email: document.getElementById("exampleInputEmail1").value,
                Password: document.getElementById("exampleInputPassword1").value,
                TitleId: PlayFab.settings.titleId
        };

        // Try to login using a email and password
        PlayFabClientSDK.LoginWithEmailAddress(loginRequest, LoginCallback);
}

function TryRegister() {
        // Create a register request for PlayFab
        var registerRequest = {
                Username: "",
                Email: "",
                Password: "",
                TitleId: PlayFab.settings.titleId
        };

        // Try to register an account using a username, email and password
        PlayFabClientSDK.RegisterPlayFabUser(registerRequest, RegisterCallBack);
}

var LoginCallback = function (result, error) {
        if (result !== null) {
                // What will happen after the login is successful? Go crazy!
                document.getElementById("alertText").innerHTML = "Successfully logged-in!";
        } else if (error !== null) {
                // Do whatever you want to do with errors here.
                document.getElementById("alertText").innerHTML = "Oops! There was a problem!";
        }
}

var RegisterCallBack = function (result, error) {
        if (result !== null) {
                // What will happen after the register is successful? Go crazy!
                document.getElementById("alertText").innerHTML = "Successfully registered account!";
        } else if (error !== null) {
                // Do whatever you want to do with errors here.
                document.getElementById("alertText").innerHTML = "Oops! There was a problem!";
        }
}