'use strict';

/* global loggerFront, angular */

/**
 * the angular logToServer which catches 
 * angularJs errors, as opposed to common js 
 * syntax errors.
 * @type type
 */
angular.module('logToServer', [])
        .service('$log', function () {

            this.warn = function (msg) {
                //IMPORTANT to pass thru or standard angular messages wont show
                // in dev console, they will be eaten and hard to debug
                console.warn(msg);
            };
            this.error = function (msg) {

                var body = {
                    message: msg.message,
                    stack: msg.stack, //smoke em if ya got em. has line no.
                    type: 'angular-error',
                    location: $location.href
                };

                loggerFront.sendToLoggerApi(body);
            };
        });

/**
 * 
 * have to use global window since this is extremely low level
 * the common js logger which catches js errors that occur outside angularJS
 * @type type
 */
window.logToFront = {
    
    /**
     * global flag
     * @type Boolean
     */
    hasError: false,
    /**
     * 
     * send messages to logApi
     * @param {object} body the text of the message
     * @param {object} settings the collection of config
     * @returns {undefined}
     */
    sendJsError: function (body, settings) {

        var apiLog = settings.apiUrl || '/api/log';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", apiLog, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(body));
    }

};
 
/**
 * browser onerror event, only send first error
 * @param {type} message  error message
 * @param {type} url the js file url
 * @param {type} lineNumber 
 * @returns {Boolean}
 */
window.onerror = function (message, url, lineNumber) {
    if (window.logToFront.hasError) {
        //deduplicating by checking bool - only send first error
        
        window.setTimeout(function () {
            window.logToFront.hasError = false;
        }, 2000);
        console.info('error hit but deduped, only showing in console.');
        return;
    } else {
        window.logToFront.hasError = true;
    }
    console.error('error:' + message + ' ' + url + ': ' + lineNumber);

    var body = {
        message: message,
        type: 'js-error',
        url: url,
        lineNumber: lineNumber,
        location: window.location.href
    };

    loggerFront.sendToLoggerApi(body);
    return true;
};