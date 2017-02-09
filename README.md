# rapport-http [![CircleCI](https://circleci.com/gh/miratronix/rapport-http.svg?style=shield)](https://circleci.com/gh/miratronix/rapport-http) [![Coverage Status](https://coveralls.io/repos/github/miratronix/rapport-http/badge.svg)](https://coveralls.io/github/miratronix/rapport-http)
[![NPM](https://nodei.co/npm/rapport-http.png)](https://npmjs.org/package/rapport-http)

Adds HTTP style methods to Rapport, intended for use with [rapport-router](https://github.com/miratronix/rapport-router).

## Installation
Node: Install the plugin via NPM: `npm install --save rapport-http`

Browser: Attach `rapport.http.min.js` to your HTML page

Then add the plugin to rapport:
```javascript
// Globally
Rapport.use(require('rapport-http')); // In Node.js
Rapport.use(RapportHttp); // In the browser

// Or to a instance
Rapport(wsImplementation).use(require('rapport-http')); // In Node.js
Rapport(wsImplementation).use(RapportHttp); // In the browser
```

## Usage
This plugin adds methods to the Rapport socket. To use it, simply call them:

```javascript
const ws = rapport.create('url');

// Create a request on /users
ws.get('/users');
ws.post('/users');
ws.put('/users');
ws.patch('/users');
ws.delete('/users');
ws.http('get', '/users');

// Add query parameters (each call appends to the query string)
ws.get('/users').query({ key: value });
ws.get('/users').query('key=value');
ws.get('/users').query(['key=value', 'key2=value2']);

// Add a body
ws.get('/users').body({ key: value }); // Merged with any existing body objects
ws.get('/users').body('some string');  // Overwrites an existing body
ws.get('/users').body([1, 2, 3]); // Also overwrites an existing body

// Add a request timeout
ws.get('/users').timeout(3000); // Times out in 3 seconds

// Send it!
ws.get('/users').send().then((response) => {}); // With a promise
ws.get('/users').send((response, err) => {}); // Or a callback

// All together now
ws.get('/users')
    .query({ id: 1 })
    .timeout(3000)
    .send()
    .then((response) => {
        console.log(`Got users: ${JSON.stringify(response)}`);    
    });
```
