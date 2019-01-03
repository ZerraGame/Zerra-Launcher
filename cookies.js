let remote = require('electron').remote;
let session = remote.session;

module.exports = {
    setCookie: function setCookie(key, data) {
        session.defaultSession.cookies.set({
            name: key,
            value: data,
            url: 'http://localhost/',
            expirationDate: Date.now()
        }, (error) => {
            console.log("Set cookie: " + key + " => " + data);
        });
    },
    getCookie: function getCookie(key, callback) {
        session.defaultSession.cookies.get({
            name: key
        }, callback);
    },
    getCookies: function getCookies(callback) {
        session.defaultSession.cookies.get({}, callback);
    }
}