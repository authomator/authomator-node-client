'use strict';

/**************************************************************************
 * Begin of tests
 *************************************************************************/

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    util = require('util');

var expect = chai.expect;
chai.use(sinonChai);

/**************************************************************************
 * Begin of tests
 *************************************************************************/

var client = require('../lib');


// Stub/mock for superagent
function stubRequest() {

    var stub = {

        _post : [],
        post: function(){
            stub._post.push(arguments);
            return stub;
        },

        _send : [],
        send: function(){
            stub._send.push(arguments);
            return stub;
        },

        end: function(cb){
            cb(null, {})
        }
    };
    return stub;
}



describe('AuthomatorNodeClient', function() {

    it('should be a function', function(){
        expect(client).to.be.a('function');
    });

    
    /**************************************************************************
          ___ _                    
         / __(_)__ _ _ _ _  _ _ __ 
         \__ \ / _` | ' \ || | '_ \
         |___/_\__, |_||_\_,_| .__/
               |___/         |_|
     *************************************************************************/
    
    describe('AuthomatorNodeClient.signup()', function(){

        var c;

        beforeEach(function() {
            c = new client();
        });

        it('should be a function', function(){
            expect(c.signup).to.be.a('function')
        });

        it('should perform a http POST to /api/auth/signup', function(done){

            var stub = stubRequest();
            stub.end = function(cb) {
                cb(null, { body: { 'it': 'itoken', 'at': 'atoken', rt: 'rtoken' }});
            };
            c._request = stub;

            c.signup('newuser@local.test', 'test', function(err, data){
                
                expect(c._request._post).to.have.length(1); // .post() was called
                expect(c._request._post[0][0]).to.equal('/api/auth/signup');
                
                expect(c._request._send).to.have.length(1); // .send() was called
                expect(c._request._send[0][0]).to.have.a.property('email', 'newuser@local.test');
                expect(c._request._send[0][0]).to.have.a.property('password', 'test');
                
                expect(data).to.have.a.property('it', 'itoken');
                expect(data).to.have.a.property('at', 'atoken');
                expect(data).to.have.a.property('rt', 'rtoken');
                expect(err).to.not.exist;

                done();
            });
        });

        it('should give an UserExistsError when HTTP 422 occurs with identities.local.email.kind = unique', function(done){

            var stub = stubRequest();
            stub.end = function(cb) {
                cb({status: 422}, { body: { errors: {'identities.local.email': { kind: 'unique'}}}});
            };
            c._request = stub;

            c.signup('newuser@local.test', 'test', function(err, data){
                expect(err).to.exists;
                expect(err).to.have.a.property('name', 'UserExistsError');
                done();
            });
        });


        it('should give an BadParamsError when HTTP 422 occurs with res.body.errors', function(done){

            var stub = stubRequest();
            stub.end = function(cb) {
                cb({status: 422}, { body: { errors: {'identities.local.email': { message: 'Invalid email'}}}});
            };
            c._request = stub;

            c.signup('newuser@local', 'test', function(err, data){

                expect(err).to.exists;
                expect(err).to.have.a.property('name', 'BadParamsError');
                expect(err).to.have.a.deep.property('errors');
                expect(err.errors['identities.local.email']).to.have.a.deep.property('message', 'Invalid email');
                done();
            });
        });


        it('should give the original error and req for unknown errors', function(done){

            var stub = stubRequest();
            stub.end = function(cb) {
                cb({status: 500}, { 'hello': 'worlderror'});
            };
            c._request = stub;

            c.signup('newuser@local', 'test', function(err, data){

                expect(err).to.exists;
                expect(data).to.have.a.property('hello', 'worlderror');
                done();
            });
        });
        
    });
    
    
    describe('AuthomatorNodeClient.login()', function() {

        var c;

        beforeEach(function () {
            c = new client();
        });

        it('should be a function', function () {
            expect(c.login).to.be.a('function')
        });

        it('should perform a http POST to /api/auth/login', function (done) {

            var stub = stubRequest();
            stub.end = function (cb) {
                cb(null, {body: {'it': 'itoken', 'at': 'atoken', rt: 'rtoken'}});
            };
            c._request = stub;

            c.login('someuser@local.test', 'test', function (err, data) {

                expect(c._request._post).to.have.length(1); // .post() was called
                expect(c._request._post[0][0]).to.equal('/api/auth/login');

                expect(c._request._send).to.have.length(1); // .send() was called
                expect(c._request._send[0][0]).to.have.a.property('email', 'someuser@local.test');
                expect(c._request._send[0][0]).to.have.a.property('password', 'test');

                expect(data).to.have.a.property('it', 'itoken');
                expect(data).to.have.a.property('at', 'atoken');
                expect(data).to.have.a.property('rt', 'rtoken');
                expect(err).to.not.exist;

                done();
            });
        });

        it('should give an InvalidCredentialsError when HTTP 401 occurs', function(done){

            //var stub = stubRequest();
            //stub.end = function(cb) {
            //    cb({status: 422}, { body: { errors: {'identities.local.email': { message: 'Invalid email'}}}});
            //};
            //c._request = stub;

            c.login('newuser@local.local', 'test', function(err, data){
                expect(err).to.exists;
                expect(err).to.have.a.property('name', 'InvalidCredentialsError');
                done();
            });
        });
        
        it('should give an BadParamsError when HTTP 422 occurs with res.body.errors', function(done){

            //var stub = stubRequest();
            //stub.end = function(cb) {
            //    cb({status: 422}, { body: { errors: {'identities.local.email': { message: 'Invalid email'}}}});
            //};
            //c._request = stub;

            c.login('invalidemail', 'test', function(err, data){
                
                expect(err).to.exists;
                expect(err).to.have.a.property('name', 'BadParamsError');
                expect(err).to.have.a.deep.property('errors');
                expect(err.errors['email']).to.have.a.deep.property('message', '"email" must be a valid email');
                done();
            });
        });


        it('should give the original error and req for unknown errors', function(done){

            var stub = stubRequest();
            stub.end = function(cb) {
                cb({status: 500}, { 'hello': 'worlderror'});
            };
            c._request = stub;

            c.signup('newuser@local', 'test', function(err, data){

                expect(err).to.exists;
                expect(data).to.have.a.property('hello', 'worlderror');
                done();
            });
        });
    });
    
    
    describe('AuthomatorNodeClient.sendResetMail()', function() {

        var c;

        beforeEach(function () {
            c = new client();
        });

        it('should be a function', function () {
            expect(c.login).to.be.a('function')
        });

        it('should perform a http POST to /api/auth/reset/mail', function (done) {

            var stub = stubRequest();
            stub.end = function (cb) {
                cb(null, {});
            };
            c._request = stub;

            c.sendResetMail('someuser@local.test', 'url', function (err, data) {

                expect(c._request._post).to.have.length(1); // .post() was called
                expect(c._request._post[0][0]).to.equal('/api/auth/reset/mail');

                expect(c._request._send).to.have.length(1); // .send() was called
                expect(c._request._send[0][0]).to.have.a.property('email', 'someuser@local.test');
                expect(c._request._send[0][0]).to.have.a.property('url', 'url');

                expect(err).to.not.exist;

                done();
            });
        });

        it('should give an NoSuchUserError when HTTP 400 occurs', function(done){

            //var stub = stubRequest();
            //stub.end = function(cb) {
            //    cb({status: 422}, { body: { errors: {'identities.local.email': { message: 'Invalid email'}}}});
            //};
            //c._request = stub;

            c.sendResetMail('newuser@local.ss', 'https://127.0.0.1/reset/', function(err, data){
                expect(err).to.have.a.property('name', 'NoSuchUserError');
                done();
            });
        });

        it('should give an BadParamsError when HTTP 422 occurs with res.body.errors', function(done){

            //var stub = stubRequest();
            //stub.end = function(cb) {
            //    cb({status: 422}, { body: { errors: {'identities.local.email': { message: 'Invalid email'}}}});
            //};
            //c._request = stub;

            c.sendResetMail('someuser@local.test', 'url', function(err, data){
                expect(err).to.exists;
                expect(err).to.have.a.property('name', 'BadParamsError');
                expect(err).to.have.a.deep.property('errors');
                expect(err.errors['url']).to.have.a.deep.property('kind', 'string.uri');
                done();
            });
        });


        it('should give the original error and req for unknown errors', function(done){

            var stub = stubRequest();
            stub.end = function(cb) {
                cb({status: 403}, { 'hello': 'worlderror'});
            };
            c._request = stub;

            c.sendResetMail('someuser@local.test', 'http://unauthorized_url/reset/', function(err, data){

                expect(err).to.exists;
                expect(data).to.have.a.property('hello', 'worlderror');
                done();
            });
        });
    });


    describe('AuthomatorNodeClient.resetPassword()', function() {

        var c;

        beforeEach(function () {
            c = new client();
        });

        it('should be a function', function () {
            expect(c.login).to.be.a('function')
        });

        it('should perform a http POST to /api/auth/reset/:token', function (done) {

            var stub = stubRequest();
            stub.end = function (cb) {
                cb(null, {});
            };
            c._request = stub;

            c.resetPassword('newpassword', 'theresettoken', function (err, data) {

                expect(c._request._post).to.have.length(1); // .post() was called
                expect(c._request._post[0][0]).to.equal('/api/auth/reset/theresettoken');

                expect(c._request._send).to.have.length(1); // .send() was called
                expect(c._request._send[0][0]).to.have.a.property('password', 'newpassword');

                expect(err).to.not.exist;

                done();
            });
        });

        it('should give an InvalidTokenError when HTTP 400 occurs', function(done){

            //var stub = stubRequest();
            //stub.end = function(cb) {
            //    cb({status: 422}, { body: { errors: {'identities.local.email': { message: 'Invalid email'}}}});
            //};
            //c._request = stub;

            c.resetPassword('newuser@local.test', 'wrongtoken', function(err, data){
                expect(err).to.have.a.property('name', 'InvalidTokenError');
                done();
            });
        });

        it('should give an BadParamsError when HTTP 422 occurs with res.body.errors', function(done){

            //var stub = stubRequest();
            //stub.end = function(cb) {
            //    cb({status: 422}, { body: { errors: {'identities.local.email': { message: 'Invalid email'}}}});
            //};
            //c._request = stub;

            c.resetPassword(1, 'url', function(err, data){
                expect(err).to.exists;
                expect(err).to.have.a.property('name', 'BadParamsError');
                expect(err).to.have.a.deep.property('errors');
                expect(err.errors['password']).to.have.a.deep.property('kind', 'string.base');
                done();
            });
        });


        it('should give the original error and req for unknown errors', function(done){

            var stub = stubRequest();
            stub.end = function(cb) {
                cb({status: 403}, { 'hello': 'worlderror'});
            };
            c._request = stub;

            c.sendResetMail('someuser@local.test', 'http://unauthorized_url/reset/', function(err, data){

                expect(err).to.exists;
                expect(data).to.have.a.property('hello', 'worlderror');
                done();
            });
        });
    });


});