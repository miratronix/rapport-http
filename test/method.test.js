'use strict';

const Rapport = require('rapport');
const util = require('./index.js');
const plugin = require('../lib/index.js');

describe('HTTP Methods', () => {

    let mockSocket;
    let testSocket;

    beforeEach(() => {
        mockSocket = util.mockWebsocket();
        testSocket = Rapport().use(plugin).wrap(mockSocket);
    });

    it('Can create a GET', () => {
        testSocket.get('/url').should.have.a.property('_method').that.equals('get');
    });

    it('Can create a POST', () => {
        testSocket.post('/url').should.have.a.property('_method').that.equals('post');
    });

    it('Can create a PUT', () => {
        testSocket.put('/url').should.have.a.property('_method').that.equals('put');
    });

    it('Can create a PATCH', () => {
        testSocket.patch('/url').should.have.a.property('_method').that.equals('patch');
    });

    it('Can create a DELETE', () => {
        testSocket.delete('/url').should.have.a.property('_method').that.equals('delete');
    });
});
