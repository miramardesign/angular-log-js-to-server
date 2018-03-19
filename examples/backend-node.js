/* global */
'use strict';

module.exports = function (app) {
    /**
     * log frontend errors to file js-errors.log, 
     * @param {object} req the request
     * @param {object} res
     * @param {object} next
     * @returns {undefined} writes to logfile  frontend-debug.log
     **/
    app.post('/api/log-js', function (req, res, next) {
        var fs = require('fs');
        var util = require('util');

        req.body.datetime = new Date().toString("yyyyMMddHHmmss");

        var msg = util.format(req.body) + ',\n';

        fs.appendFile('js-errors.log', msg, function (err) {
            if (err) {
                throw err;
            }
            
            return res.json({
                'error_recieved': true
            });
        });

    });
};