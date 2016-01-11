//Headless automation with PhantomJs
"use strict";
var page = require('webpage').create(),
    system = require('system'),
    address, t;


// how long should we wait for the page to load before we exit
// in ms
var WAIT_TIME = 5000;

// if the page hasn't loaded after this long, something is probably wrong.
// in ms
var MAX_EXECUTION_TIME = 15000;

// output error messages
var DEBUG = false;

var resources_to_log = [
    new RegExp('^http(s)?://(www|ssl)\.google-analytics\.com.*'),
    new RegExp('^http(s)?://stats\.g\.doubleclick\.net.*')
];


var Mozilla35 = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0';
var Chrome47 = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36";

var Linux = "Linux x86_64";

page.onInitialized = function () {
    page.evaluate(function () {

        (function (console) {
            console.log("awesome");
            var userAgent = window.navigator.userAgent,
                platform = window.navigator.platform;

            /* window.navigator = {
                 appCodeName: "Mozilla",
                 appName: "Netscape",
                 appVersion: "5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
                 cookieEnabled: true,
                 doNotTrack: null,
                 geolocation: {},
                 hardwareConcurrency: 4,
                 language: "en-US",
                 languages: ['en', 'en-US'],
                 maxTouchPoints: 0,
                 mediaDevices: {},
                 //mimeTypes: MimeTypeArray,
                 onLine: true,
                 permissions: {},
                 platform: "Linux x86_64",
                 plugins: {
                     0: {
                         0: {
                             description: "Widevine Content Decryption Module",
                             enabledPlugin: {
                                 description: "Widevine Content Decryption Module",
                                 enabledPlugin: {length:0},
                                 suffixes: "",
                                 type: "application/x-ppapi-widevine-cdm"
                             },
                             suffixes: "",
                             type: "application/x-ppapi-widevine-cdm"
                         },
                         description: "Enables Widevine licenses for playback of HTML audio/video content. (version: 1.4.8.866)",
                         filename: "widevinecdmadapter.dll",
                         length: 1,
                         name: "Widevine Content Decryption Module",
                     },
                     length:1,
                 },
                 presentation: {
                     defaultRequest: null
                 },
                 product: "Gecko",
                 productSub: "20030107",
                 //serviceWorker: ServiceWorkerContainer,
                 userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
                 vendor: "Google Inc.",
                 vendorSub: "",
                 //webkitPersistentStorage: DeprecatedStorageQuota,
                 //webkitTemporaryStorage: DeprecatedStorageQuota,
             };*/

           /* for /l %x in (1, 1, 100) do (
   echo %x
   copy %x.txt z:\whatever\etc
)*/
            
            var fakePlatformGetter = function () {
                return "Linux x86_64";
            };
           // if (Object.defineProperty) {
                //Object.defineProperty(window.navigator, "platform", {
                 //   get: fakePlatformGetter
                //});
            //} else if (Object.prototype.__defineGetter__) {
                navigator.__defineGetter__("platform", fakePlatformGetter);
            //}

            /* window.navigator.__defineGetter__('userAgent', function () {
                 window.navigator.sniffed = true;
                 return userAgent;
             });

             window.navigator.__defineGetter__('platform', function () {
                 window.navigator.sniffed = true;
                 return "Linux";
             });*/


        })(console);
    });
};


// set our custom referer [sic]
page.customHeaders = {
    "Referer": "http://stackoverflow.com/questions/19398876/dynamic-proxy-in-phantomjs"
};


if (system.args.length === 1) {
    console.log('Usage: rawbot.js <some URL>');
    phantom.exit(1);
} else {

    address = system.args[1];
    t = Date.now();
    page.settings.userAgent = Mozilla35;

    page.onLoadStarted = function () {
        page.customHeaders = {};
    };

    try {
        page.open(address, function (status) {
            if (status !== 'success') {
                console.log('Unable to access network');
            } else {
                t = Date.now() - t;
                console.log('Platform is ' + page.evaluate(function () {
                    return window.navigator.platform;
                }));
                console.log('Loading time ' + t + ' msec');

            }
            setTimeout(function () {
                phantom.exit();
            }, WAIT_TIME);
        });
    } finally {
        // if we are still running after MAX_EXECUTION_TIME ms exit
        setTimeout(function () {
            console.log("FAILED: Max execution time " + Math.round(MAX_EXECUTION_TIME) + " seconds exceeded");
            phantom.exit(1);
        }, MAX_EXECUTION_TIME);
    }
}
