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
                TryLogin(GetElementValue("AccountEmail"), GetElementValue("AccountPassword"));
        });

        $("#register").click(function () {
                TryRegister(GetElementValue("RegisterUsername"), GetElementValue("RegisterEmail"), GetElementValue("RegisterPassword"), GetElementValue("RegisterRepeatPassword"));
        });

        $("#signout").click(function () {
                SignOut();
        });
}

// Sign the user out of the launcher
function SignOut() {
        process.env.isLoggedIn = false;

        $('#signInBtn').show();
        $('#AccountInfo').hide();
}

function TryLogin(Email, Password) {
        // Create a login request for PlayFab
        var loginRequest = {

                Email: Email,
                Password: Password,
                TitleId: PlayFab.settings.titleId
        };

        // Try to login using a email and password
        PlayFabClientSDK.LoginWithEmailAddress(loginRequest, LoginCallback);
}

function TryRegister(Usernamme, Email, Password, RepeatPassword) {
        // Check if the passwords match, if they don't then give a little alert
        if (Password !== RepeatPassword) {
                document.getElementById("registerAlertText").innerHTML = "Passwords do not match!";
                return
        }

        // Create a register request for PlayFab
        var registerRequest = {
                Username: Usernamme,
                Email: Email,
                Password: Password,
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
                $('#signInBtn').hide();

                // Store account info in environment variables
                process.env.isLoggedIn = true;

                // Get the accounts profile info so we can set stuff like display name or avatar
                PlayFabClientSDK.GetPlayerProfile({
                        PlayFabId: result.data.PlayFabId,
                        ProfileConstraints: {
                                ShowDisplayName: true
                        }
                }, function (response, error) {
                        if (response !== null) {
                                // What will happen after the register is successful? Go crazy!
                                $('#AccountInfo').show();
                                document.getElementById("AccountInfo").innerHTML = response.data.PlayerProfile.DisplayName;
                        } else if (error !== null) {
                                // Do whatever you want to do with errors here.
                        }
                });
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

                PlayFabClientSDK.UpdateUserTitleDisplayName({
                        DisplayName: document.getElementById("RegisterUsername").value
                }, function (response, error) {

                });
        } else if (error !== null) {
                // Do whatever you want to do with errors here.
                document.getElementById("registerAlertText").innerHTML = "Oops! There was a problem!";
        }
}

// A function to get a elements value. Just here to keep code clean.
function GetElementValue(name) {
        return document.getElementById(name).value;
}