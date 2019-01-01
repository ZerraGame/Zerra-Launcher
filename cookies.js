let remote = require('electron').remote;
let session = remote.session;

module.exports = {
    setCookie: function setCookie(name, data) {
        session.defaultSession.cookies.set({
            name: name,
            value: data,
            url: 'http://localhost/',
            expirationDate: Date.now()
        }, (error) => {
            console.log("Set cookie: " + name + " => " + data);
        });
    },
    getCookie: function getCookie(name) {
        session.defaultSession.cookies.get({
            name: name
        }, (error, cookies) => {
            return cookies[0].value;
        });
    }
}