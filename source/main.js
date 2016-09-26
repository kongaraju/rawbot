/*
Input: Referer => URL that refers to destination page
Job : navigates to referal url 
from that destination url 
with random user agent string 
and spents random number of seconds 
then navigates to internal page of the destination url 

*/


var system = require('system');
var fs = require("fs");
var page = require('webpage').create();

//userAgent handling
var userAgents = require("./userAgents.js").userAgentsArr;
//var userAgentsStr = fs.open(".\userAgents.js", "r");
var userAgentsArr = userAgents;
var randUA = randomArrItem(userAgentsArr);

//Timings
var Min_Duration = 2;
var Max_Duration = 5;
var Random_Duration_Minutes = randomVal(Max_Duration, Min_Duration);
var Session_Duration =  Random_Duration_Minutes * 60 * 1000; //random minuts
var LINK_INTERVAL = 30 * 1000; // 30 Seconds
var Min_Pages = 1;
var Max_Pages_Per_Session = randomVal(Random_Duration_Minutes, Min_Pages) + 1;//+1 for referer visit
var Visit_Counter = 0;

// Exit in case of wrong parameter count.
if (system.args.length !== 3) {
    console.log('Usage: scriptname targetUrl referrer');
    console.log('example: $> phantomjs fake-referrer.phantom.js http://example.com http://referrer.example.com');
    phantom.exit(1);
}

//TODO: screen resolution

// Set the important pieces
var targetUrl = system.args[1];
var referrer = system.args[2];
var isFirstLoad = true;

function randomArrItem(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

function randomVal(max,min){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log('Going to open ' + targetUrl + ' with the referrer ' + referrer);

// set our custom referer [sic]
page.customHeaders = {
    "Referer": referrer
};

page.settings.userAgent = randUA;

page.onInitialized = function () {
    page.evaluate(function() {
        delete window.callPhantom;
        delete window._phantom;
    });
};

page.onLoadFinished = function (status) {
    Visit_Counter++;
    if(Visit_Counter>Max_Pages_Per_Session){
        return false;
    }
    
    // get the currentUrl
    var currentUrl = page.evaluate(function () {
        return document.location.href;
    });

    // get the referrer
    var currentReferrer = page.evaluate(function () {
        return document.referrer;
    });
    
     // get the test
	var result = page.evaluate(function() {
		//return document.querySelectorAll("table td").length ? document.querySelectorAll("table td")[3].innerHTML : " IP Not found ";
        //return window.__phantomas;
        //return navigator.userAgent;
        //return navigator.onLine;
        //return document.hidden;
        //return document.visibilityState;
        //return document.activeElement.nodeName;
	});
    
	//console.log(result);

    console.log('Loading ' + currentUrl + ' finished with status: ' + status + '. document.referrer is: ' + currentReferrer);
    console.log('Injecting the Link.');

    // Inject and Click a Link to our target
    var link = page.evaluate(function (href, FirstLoad, interval) {
        if (FirstLoad) {

            // Create and append the link
            var link = document.createElement('a');
            link.setAttribute('href', href);
            document.body.appendChild(link);

        } else {           

            var link = document.querySelectorAll("a")[3];
            if(!link.href){
                link = document.querySelectorAll("a")[17];
            }

        }

        setTimeout(function (link) {
            // Dispatch Click Event on the link
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, link);
            link.dispatchEvent(evt);
        }.bind(window, link), interval);

        return link.href;

    }, targetUrl, isFirstLoad ,LINK_INTERVAL);
    
    console.log("\n\n" + link + " is going to show \n");

    if (page.firstLoad) {
        page.firstLoad = false;
        isFirstLoad = false;
        setTimeout(function () {
            console.log('Exiting');
            phantom.exit();
        }, Session_Duration);
    }
};

page.firstLoad = true;
page.open(referrer);
