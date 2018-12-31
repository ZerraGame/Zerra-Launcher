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

        $("#register").click(function () {
                TryRegister();
        });
}

function TryLogin() {
        // Create a login request for PlayFab
        var loginRequest = {
                Email: document.getElementById("AccountEmail").value,
                Password: document.getElementById("AccountPassword").value,
                TitleId: PlayFab.settings.titleId
        };

        // Try to login using a email and password
        PlayFabClientSDK.LoginWithEmailAddress(loginRequest, LoginCallback);
}

function TryRegister() {
        if (document.getElementById("RegisterPassword").value !== document.getElementById("RegisterRepeatPassword").value) {
                document.getElementById("registerAlertText").innerHTML = "Passwords do not match!";
                return
        }

        // Create a register request for PlayFab
        var registerRequest = {
                Username: document.getElementById("RegisterUsername").value,
                Email: document.getElementById("RegisterEmail").value,
                Password: document.getElementById("RegisterPassword").value,
                TitleId: PlayFab.settings.titleId
        };

        // Try to register an account using a username, email and password
        PlayFabClientSDK.RegisterPlayFabUser(registerRequest, RegisterCallBack);
}

var LoginCallback = function (result, error) {
        if (result !== null) {
                // What will happen after the login is successful? Go crazy!
                document.getElementById("loginAlertText").innerHTML = "Successfully logged-in!";

                // Close the login modal
                $('#accountModal').modal('hide');
        } else if (error !== null) {
                // Do whatever you want to do with errors here.
                document.getElementById("loginAlertText").innerHTML = "Oops! There was a problem!";
        }
}

var RegisterCallBack = function (result, error) {
        if (result !== null) {
                // What will happen after the register is successful? Go crazy!
                document.getElementById("registerAlertText").innerHTML = "Successfully registered account!";

                // Close the register modal
                $('#registerModal').modal('hide');
        } else if (error !== null) {
                // Do whatever you want to do with errors here.
                document.getElementById("registerAlertText").innerHTML = "Oops! There was a problem!";
        }
}