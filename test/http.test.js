'use strict';

const Rapport = require('rapport');
const util = require('./index.js');
const plugin = require('../lib/index.js');

describe('HTTP', () => {

    let mockSocket;
    let testSocket;

    beforeEach(() => {
        mockSocket = util.mockWebsocket();
        testSocket = Rapport().use(plugin).wrap(mockSocket);
    });

    context('body', () => {

        it('Can add a body object', () => {
            const http = testSocket.http('get', '/test').body({ key: 'value' });
            http._body.should.have.a.property('key').that.equals('value');
        });

        it('Can add multiple body objects', () => {
            const http = testSocket.http('get', '/test')
                .body({ key: 'value' })
                .body({ key2: 'value2' });

            http._body.should.have.a.property('key').that.equals('value');
            http._body.should.have.a.property('key2').that.equals('value2');
        });

        it('Can add a non-object body', () => {
            const http = testSocket.http('get', '/test').body('hello');
            http._body.should.equal('hello');
        });

        it('Overwrites the body with a non-object body', () => {
            const http = testSocket.http('get', '/test')
                .body({ key: 'value' })
                .body('some string');

            http._body.should.equal('some string');
        });
    });

    context('query', () => {

        it('Can add a query object', () => {
            const http = testSocket.http('get', '/test').query({ key: 'value' });
            http._url.should.equal('/test?key=value');
        });

        it('Can add multiple query objects', () => {
            const http = testSocket.http('get', '/test')
                .query({ key: 'value' })
                .query({ keys: 'values' });

            http._url.should.equal('/test?key=value&keys=values');
        });

        it('Can add a string query', () => {
            const http = testSocket.http('get', '/test').query('key=value');
            http._url.should.equal('/test?key=value');
        });

        it('Can add an array query', () => {
            const http = testSocket.http('get', '/test').query(['key=value', 'keys=values']);
            http._url.should.equal('/test?key=value&keys=values');
        });

        it('Appends the previous query with a query string', () => {
            const http = testSocket.http('get', '/test')
                .query({ key: 'value' })
                .query('keys=values');

            http._url.should.equal('/test?key=value&keys=values');
        });

        it('Appends the previous query with a query array', () => {
            const http = testSocket.http('get', '/test')
                .query({ key: 'value' })
                .query(['keys=values']);

            http._url.should.equal('/test?key=value&keys=values');
        });

        it('Throws if the query isn\'t an object, array, or string', () => {
            (() => {
                testSocket.http('get', '/test').query(42);
            }).should.throw(TypeError, 'Query must be a url encoded string, object, or array');
        });
    });

    context('timeout', () => {

        it('Can set a timeout', () => {
            const http = testSocket.http('get', '/test').timeout(42);
            http._timeout.should.equal(42);
        });

        it('Ignores a negative timeout', () => {
            const http = testSocket.http('get', '/test').timeout(-42);
            http._timeout.should.equal(0);
        });

        it('Throws when anything but a number is supplied', () => {
            (() => {
                testSocket.http('get', '/test').timeout('lol');
            }).should.throw(TypeError, 'Timeout must be a numeric value');
        });
    });

    context('expectResponse', () => {

        it('Sets the expect response flag', () => {
            const http = testSocket.http('get', '/test').expectResponse(false);
            http._expectResponse.should.equal(false);
        });
    });

    context('send', () => {

        it('Sends a request with a promise', () => {
            return new Promise((resolve) => {
                testSocket.http('get', '/test').send().then(resolve);
                mockSocket.fire('message', {
                    _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                    _b: {}
                });
            });
        });

        it('Sends a request with a callback', () => {
            return new Promise((resolve) => {
                testSocket.http('get', '/test').send(resolve);
                mockSocket.fire('message', {
                    _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                    _b: {}
                });
            });
        });

        it('Sends the request method', () => {
            return new Promise((resolve) => {
                testSocket.http('get', '/test').send().then(resolve);
                mockSocket.fire('message', {
                    _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                    _b: {}
                });
            }).then(() => {
                JSON.parse(mockSocket.lastSentMessage)._b.should.have.a.property('_m').that.equals('get');
            });
        });

        it('Sends the request URL', () => {
            return new Promise((resolve) => {
                testSocket.http('get', '/test').send().then(resolve);
                mockSocket.fire('message', {
                    _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                    _b: {}
                });
            }).then(() => {
                JSON.parse(mockSocket.lastSentMessage)._b.should.have.a.property('_u').that.equals('/test');
            });
        });

        it('Sends the request body', () => {
            return new Promise((resolve) => {
                testSocket.http('get', '/test').body('hello').send().then(resolve);
                mockSocket.fire('message', {
                    _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                    _b: {}
                });
            }).then(() => {
                JSON.parse(mockSocket.lastSentMessage)._b.should.have.a.property('_b').that.equals('hello');
            });
        });

        it('Sends the request query', () => {
            return new Promise((resolve) => {
                testSocket.http('get', '/test').query('key=value').send().then(resolve);
                mockSocket.fire('message', {
                    _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                    _b: {}
                });
            }).then(() => {
                JSON.parse(mockSocket.lastSentMessage)._b.should.have.a.property('_u').that.equals('/test?key=value');
            });
        });

        it('Uses the request timeout', () => {
            return testSocket.http('get', '/test').timeout(10).send()
                .should.be.rejectedWith(Error, 'Timed out after 10 ms');
        });

        it('Sends the request object alone when no response is expected', () => {
            testSocket.http('get', '/test').body('hello').expectResponse(false).send();
            const lastSentMessage = JSON.parse(mockSocket.lastSentMessage);
            lastSentMessage.should.have.a.property('_u').that.equals('/test');
            lastSentMessage.should.have.a.property('_m').that.equals('get');
            lastSentMessage.should.have.a.property('_b').that.equals('hello');
        });

        context('Translates responses', () => {

            it('Translates a good response when using a callback', () => {
                return new Promise((resolve) => {
                    testSocket.http('get', '/test').send((res) => {
                        res.should.have.a.property('status').that.equals(42);
                        res.should.have.a.property('body').that.equals('hello');
                        resolve();
                    });
                    mockSocket.fire('message', {
                        _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                        _b: {
                            _s: 42,
                            _b: 'hello'
                        }
                    });
                });
            });

            it('Translates an error response when using a callback', () => {
                return new Promise((resolve) => {
                    testSocket.http('get', '/test').send((res, err) => {
                        err.should.have.a.property('status').that.equals(42);
                        err.should.have.a.property('body').that.equals('goodbye');
                        resolve();
                    });
                    mockSocket.fire('message', {
                        _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                        _e: {
                            _s: 42,
                            _b: 'goodbye'
                        }
                    });
                });
            });

            it('Translates a good response when using a promise', () => {
                return new Promise((resolve) => {
                    testSocket.http('get', '/test').send().then((res) => {
                        res.should.have.a.property('status').that.equals(42);
                        res.should.have.a.property('body').that.equals('hello');
                        resolve();
                    });
                    mockSocket.fire('message', {
                        _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                        _b: {
                            _s: 42,
                            _b: 'hello'
                        }
                    });
                });
            });

            it('Translates an error response when using a callback', () => {
                return new Promise((resolve) => {
                    testSocket.http('get', '/test').send().catch((err) => {
                        err.should.have.a.property('status').that.equals(42);
                        err.should.have.a.property('body').that.equals('goodbye');
                        resolve();
                    });
                    mockSocket.fire('message', {
                        _rs: JSON.parse(mockSocket.lastSentMessage)._rq,
                        _e: {
                            _s: 42,
                            _b: 'goodbye'
                        }
                    });
                });
            });
        });
    });

    it('Throws if the method is not a string', () => {
        (() => {
            testSocket.http({}, '/test');
        }).should.throw(TypeError, 'HTTP method must be a string');
    });

    it('Throws if the url is not a string', () => {
        (() => {
            testSocket.http('hello', {});
        }).should.throw(TypeError, 'HTTP URL must be a string');
    });
});
