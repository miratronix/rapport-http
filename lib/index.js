'use strict';

/**
 * Defines the Rapport plugin.
 */
const RapportPlugin = {

    /**
     * Adds HTTP functions to the websocket.
     *
     * @param {object} wrappedSocket The wrapped websocket to extend.
     * @param {object} standardSocket The standard websocket.
     * @param {object} requestCache The rapport request cache.
     * @param {object} options The rapport options.
     */
    extendWebsocket: (wrappedSocket, standardSocket, requestCache, options) => {

        wrappedSocket._functions.http = require('./websocket/http.js');
        wrappedSocket._functions.get = require('./websocket/get.js');
        wrappedSocket._functions.post = require('./websocket/post.js');
        wrappedSocket._functions.put = require('./websocket/put.js');
        wrappedSocket._functions.patch = require('./websocket/patch.js');
        wrappedSocket._functions.delete = require('./websocket/delete.js');

        wrappedSocket.http = wrappedSocket._functions.http.bind(null, wrappedSocket, options);
        wrappedSocket.get = wrappedSocket._functions.get.bind(null, wrappedSocket);
        wrappedSocket.post = wrappedSocket._functions.post.bind(null, wrappedSocket);
        wrappedSocket.put = wrappedSocket._functions.put.bind(null, wrappedSocket);
        wrappedSocket.patch = wrappedSocket._functions.patch.bind(null, wrappedSocket);
        wrappedSocket.delete = wrappedSocket._functions.delete.bind(null, wrappedSocket);
    }
};

if (typeof window !== 'undefined') {
    window.RapportHttp = RapportPlugin;
}

if (typeof module !== 'undefined') {
    module.exports = RapportPlugin;
}
