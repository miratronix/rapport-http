'use strict';

const util = require('../util.js');

/**
 * @typedef {object} HTTP
 * @property {function} body
 * @property {function} query
 * @property {function} timeout
 * @property {function} send
 */

/**
 * Makes a HTTP-like request on the socket.
 *
 * @param {object} wrappedSocket The wrapped socket.
 * @param {string} method The request method to use.
 * @param {string} url The request url.
 * @return {HTTP} The request promise if promises are enabled, or undefined.
 */
module.exports = (wrappedSocket, method, url) => {

    if (!util.isString(method)) {
        throw new TypeError('HTTP method must be a string');
    }

    if (!util.isString(url)) {
        throw new TypeError('HTTP URL must be a string');
    }

    const http = {

        _method: method,
        _url: url,
        _body: {},
        _timeout: 0,

        /**
         * Adds a body to the request. If an object is supplied, the body will be appended with the objects keys and values.
         * If a anything but an object is supplied, the body is overwritten with the supplied value.
         *
         * @param {*} body The body to add to the request.
         * @return {HTTP} The HTTP object, for chaining.
         */
        body: (body) => {
            if (body) {

                if (util.isObject(body)) {
                    util.forEach(body, (key, value) => {
                        http._body[key] = value;
                    });

                } else {
                    http._body = body;
                }
            }
            return http;
        },

        /**
         * Adds query parameters to the request url. If an object is supplied, the keys and values are URI encoded and
         * appended to the URL. If a string is supplied, it is appended ot the end of the URL as is. If an array is supplied,
         * it is joined with "&" and the resulting string is appended to the url.
         *
         * @param {object|string|array} query The query parameters.
         * @return {HTTP} The HTTP object, for chaining.
         */
        query: (query) => {
            if (query) {
                let queryString = '';

                if (util.isString(query)) {
                    queryString = query;

                } else if (util.isArray(query)) {
                    queryString = query.join('&');

                } else if (util.isObject(query)) {
                    const queryArray = [];

                    util.forEach(query, (key, value) => {
                        queryArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                    });
                    queryString = queryArray.join('&');

                } else {
                    throw new TypeError('Query must be a url encoded string, object, or array');
                }


                if (http._url.indexOf('?') >= 0) {
                    http._url = `${http._url}&${queryString}`;
                } else {
                    http._url = `${http._url}?${queryString}`;
                }
            }
            return http;
        },

        /**
         * Sets a timeout for the request, in milliseconds.
         *
         * @param {number} ms The length of the timeout, in milliseconds.
         * @return {HTTP} The HTTP object, for chaining.
         */
        timeout: (ms) => {
            if (!util.isNumber(ms)) {
                throw new TypeError('Timeout must be a numeric value');
            }

            if (ms > 0) {
                http._timeout = ms;
            }
            return http;
        },

        /**
         * Sends the request. If promises are enabled, this returns a promise. Otherwise, a callback must be supplied.
         *
         * @param {function} [cb] The callback to use.
         * @return {Promise|undefined}
         */
        send: (cb) => {
            return wrappedSocket.request({
                method: http._method,
                url: http._url,
                body: http._body,
            }, http._timeout, cb);
        }
    };

    return http;
};
