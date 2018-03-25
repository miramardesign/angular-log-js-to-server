'use strict';

/* global angular, logToServer */

/**
 * the angular logToServer module
 * @type type
 */
angular.module('logToServer', [])
        .service('$log', function () {

            this.error = function (msg) {

                var body = {
                    message: msg.message,
                    stack: msg.stack,
                    type: 'angularjs-error',
                    location: window.location.href
                };

                logToServer.sendJsError(body);
            };

            this.warn = function (msg) {
                console.warn(msg);
            };


        });
/**
 * 
 * have to use global window since this is extremely low level
 * the common js logger which catches js errors that occur outside angularJS
 * @type type
 */
window.logToServer = {

    /**
     * global flag
     * @type Boolean
     */
    hasError: false,
    /**
     * 
     * send messages to logApi
     * tried injecting $http but causes circular references
     * @param {object} message the text of the message
     * @param {object} settings the collection of config
     * @returns {undefined}
     */
    sendJsError: function (message, settings) {

        var apiLog = settings && settings.apiUrl || '/api/log-js';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", apiLog, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(message));
    },
    /**
     * 
     * @param {type} message
     * @param {type} url
     * @param {type} lineNumber
     * @returns {undefined|Boolean}
     */
    onError: function (message, url, lineNumber) {

        //remove 2nd error
        if (window.logToServer.hasError) {

            window.setTimeout(function () {
                window.logToServer.hasError = false;
            }, 2000);
            console.info('error hit but deduped, only showing in console.');
            return;
        } else {
            window.logToServer.hasError = true;
        }
        console.error('error:' + message + ' ' + url + ': ' + lineNumber);

        var messageObj = {
            message: message,
            type: 'js-error',
            url: url,
            lineNumber: lineNumber,
            location: window.location.href
        };

        logToServer.sendJsError(messageObj);
        return true;
    }
};

window.onerror = logToServer.onError;