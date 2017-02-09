'use strict';

const Rapport = require('rapport');
const util = require('./index.js');
const plugin = require('../lib/index.js');

describe('Plugin', () => {

    let rapport;
    let testSocket;

    beforeEach(() => {
        rapport = Rapport().use(plugin);
        testSocket = rapport.wrap(util.mockWebsocket());
    });

    it('Adds the http method to wrapped websocket', () => {
        testSocket.should.have.a.property('http').that.is.a('function');
    });

    it('Adds the get method to wrapped websocket', () => {
        testSocket.should.have.a.property('get').that.is.a('function');
    });

    it('Adds the post method to wrapped websocket', () => {
        testSocket.should.have.a.property('post').that.is.a('function');
    });

    it('Adds the put method to wrapped websocket', () => {
        testSocket.should.have.a.property('put').that.is.a('function');
    });

    it('Adds the patch method to wrapped websocket', () => {
        testSocket.should.have.a.property('patch').that.is.a('function');
    });

    it('Adds the delete method to wrapped websocket', () => {
        testSocket.should.have.a.property('delete').that.is.a('function');
    });

    it('Adds itself to the window if it\'s present', () => {
        global.window = {};
        delete require.cache[require.resolve('../lib/index.js')];
        require('../lib/index.js');
        global.window.should.have.a.property('RapportHttp').that.is.an('object');
        delete global.window;
    });
});
