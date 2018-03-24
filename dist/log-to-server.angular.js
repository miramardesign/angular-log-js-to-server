'use strict';

/* global angular, logToServer */

/**
 * the angular logToServer module
 * uses globals window.onerror and window.logToFront 
 * @type type
 */
angular.module('logToServer', [])
        /**
         * 
         * @param {type} $http angular ajax 
         * @param {type} $location angular location 
         * @param {type} settings a setting object optional if not uses url 
         * endpoint '/api/log-js'
         * @returns {undefined}
         */
        .service('$log', ['$http', '$location', 'settings',
            function ($http, $location, settings) {

                this.error = function (msg) {

                    var body = {
                        message: msg.message,
                        stack: msg.stack,
                        type: 'angular-error',
                        location: $location.absUrl()
                    };
                    logToServer.sendJsError(body, settings);
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
                window.logToServer = {
                    /**
                     * 
                     * send messages to logApi
                     * @param {object} message the text of the message
                     * @param {object} settings the collection of config
                     * @returns {undefined}
                     */
                    sendJsError: function (message, settings) {

                        var req = {
                            method: 'POST',
                            url: settings.apiUrl || '/api/log-js',
                            headers: {
                                'Content-Type': "application/json;charset=UTF-8"
                            },
                            data: JSON.stringify(message)
                        };

                        $http(req).then(function (res) {
                            console.log('data sent to server- res:', res);
                        });
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
                            location: $location.absUrl()
                        };
                        logToServer.sendJsError(messageObj);
                        return true;
                    }
                };
                window.onerror = logToServer.onError;
            }]);