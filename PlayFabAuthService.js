$(document).ready(function () {
        Load();
});

const cookies = require('./cookies.js');
const settings = require('./settings.js');

let remote = require('electron').remote;
let sessionCookies = remote.session.defaultSession.cookies;

var sendFeedBack = true;

function Load() {
        'use strict';

        // Read our playfab settings JSON file
        const fs = require('fs');

        let fileContents = fs.readFileSync('playfab_settings.json');
        let jsonContents = JSON.parse(fileContents);

        PlayFab.settings.titleId = jsonContents.database_key;

        // Check if the account should be signed back in
        if (settings.getSettings().RememberInfo && settings.getSettings().KeepLoggedIn) {
                sessionCookies.get({}, (error, cookies) => {
                        for (var i = 0; i < cookies.length; i++) {
                                if (cookies[i].name === "Session_EMAIL" && cookies[i + 1].name === "Session_PASSWORD") {
                                        if (cookies[i].value && cookies[i + 1].value) {
                                                $('#accountModal').modal('hide');
                                                $('#signInBtn').hide();

                                                sendFeedBack = false;

                                                TryLogin(cookies[i].value, cookies[i + 1].value);

                                                document.getElementById("AccountEmail").value = cookies[i].value;
                                                document.getElementById("AccountPassword").value = cookies[i + 1].value;

                                                document.getElementById("loginAlertText").innerHTML = "";
                                        }
                                }
                        }
                });
        } else if (settings.getSettings().RememberEmail) {
                sessionCookies.get({}, (error, cookies) => {
                        for (var i = 0; i < cookies.length; i++) {
                                if (cookies[i].name === "Session_EMAIL" && cookies[i + 1].name === "Session_PASSWORD") {
                                        if (cookies[i].value && cookies[i + 1].value) {
                                                document.getElementById("AccountEmail").value = cookies[i].value;
                                                document.getElementById("AccountPassword").value = cookies[i + 1].value;

                                                document.getElementById("loginAlertText").innerHTML = "";
                                        }
                                }
                        }
                });  
        }

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
                Alert("registerAlertText", "Passwords do not match!");

                return;
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
                Alert("registerAlertText", "Successfully logged-in!");

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

                if (settings.getSettings().RememberInfo && GetElementValue("AccountEmail") && GetElementValue("AccountPassword")) { // && cookies.getCookie('Session_EMAIL') && cookies.getCookie('Session_PASSWORD')) {
                        cookies.setCookie("Session_EMAIL", GetElementValue("AccountEmail"));
                        cookies.setCookie("Session_PASSWORD", GetElementValue("AccountPassword"));
                }

                sendFeedBack = true;
        } else if (error !== null) {
                // Do whatever you want to do with errors here.
                Alert("registerAlertText", "Oops! There was a problem!");
        }
}

var RegisterCallBack = function (result, error) {
        if (result !== null) {
                Alert("registerAlertText", "Successfully registered account!");

                // Close the register modal
                $('#registerModal').modal('hide');

                PlayFabClientSDK.UpdateUserTitleDisplayName({
                        DisplayName: document.getElementById("RegisterUsername").value
                }, function (response, error) {

                });

                sendFeedBack = true;
        } else if (error !== null) {
                // Do whatever you want to do with errors here.
                Alert("registerAlertText", "Oops! There was a problem!");
        }
}

// A function to get a elements value. Just here to keep code clean.
function GetElementValue(name) {
        return document.getElementById(name).value;
}

function Alert(alertElement, text) {
        if (sendFeedBack === true) {
                document.getElementById("registerAlertText").innerHTML = "Oops! There was a problem!";
        } else {
                sendFeedBack = false;
        }
}