'use strict';

/**
 * Does a POST request on the socket.
 *
 * @param {object} wrappedSocket The wrapped socket.
 * @param {string} route The route to make the request on.
 * @return {HTTP} The http request object.
 */
module.exports = (wrappedSocket, route) => {
    return wrappedSocket.http('post', route);
};
