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
                    type: 'angular-error',
                    location: $location.href
                };

                logToServer.sendToLoggerApi(body);
            };

            this.warn = function (msg) {
                console.warn(msg);
            };
            
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
                 * @param {object} message the text of the message
                 * @param {object} settings the collection of config
                 * @returns {undefined}
                 */
                sendJsError: function (message, settings) {

                    var apiLog = settings.apiUrl || '/api/log';
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
                    if (window.logToFront.hasError) {

                        window.setTimeout(function () {
                            window.logToFront.hasError = false;
                        }, 2000);
                        console.info('error hit but deduped, only showing in console.');
                        return;
                    } else {
                        window.logToFront.hasError = true;
                    }
                    console.error('error:' + message + ' ' + url + ': ' + lineNumber);

                    var messageObj = {
                        message: message,
                        type: 'js-error',
                        url: url,
                        lineNumber: lineNumber,
                        location: window.location.href
                    };

                    logToServer.sendToLoggerApi(messageObj);
                    return true;
                }
            };


            window.onerror = logToFront.onError;

        });