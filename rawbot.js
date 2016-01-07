//Headless automation with PhantomJs
"use strict";
var page = require('webpage').create(),
 system = require('system'),
 address,t;
var Mozilla35 = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:35.0) Gecko/20100101 Firefox/35.0';
console.log('The default user agent is ' + page.settings.userAgent);

if (system.args.length === 1) {
    console.log('Usage: rawbot.js <some URL>');
    phantom.exit(1);
}

page.onInitialized = function () {
    page.evaluate(function () {

        (function () {
            var platform = "Linux";

            window.navigator.__defineGetter__('platform', function () {
                window.navigator.sniffed = true;
                return platform;
            });
        })();
    });
};

address = system.args[1];
 t = Date.now();
page.settings.userAgent = 'Mozilla35';
page.open(, function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        t = Date.now() - t;
        console.log('Page title is ' + page.evaluate(function () {
            return document.title;
        }));
        console.log('Loading time ' + t + ' msec');
    }
    phantom.exit();
});
