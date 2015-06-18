'use strict';

/**************************************************************************
 * Begin of tests
 *************************************************************************/
    
var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

var expect = chai.expect;
chai.use(sinonChai);

/**************************************************************************
 * Begin of tests
 *************************************************************************/

var superagent = require('superagent');
var ApiRequest = require('../lib/api');


describe('ApiRequest', function() {
    
    it('should be a function', function(){
        expect(ApiRequest).to.be.a('function');
    });
    
    it('should create an ApiRequest instance', function(){
        expect(new ApiRequest()).to.be.an('object');
        expect(new ApiRequest()).to.be.an.instanceOf(ApiRequest);
    });
    
    it('should accept options and set these internally', function(){
        var r = new ApiRequest({'world': 'hello', url: 'test.com', timeout: -1000});
        expect(r._opts).to.have.a.property('world', 'hello');
        expect(r._opts).to.have.a.property('url', 'test.com');
        expect(r._opts).to.have.a.property('timeout', -1000);
    });
    
    ['post', 'get', 'put', 'delete'].forEach(function(method){
        
        describe('ApiRequest.' + method.toUpperCase() + '()', function(){

            var r = new ApiRequest({api: 'http://authomator.local:3000/api/', timeout: 6666});

            it('is a function', function(){
                expect(r[method]).to.be.a('function');
            });
            
            it('returns a configured Request instance', function(){
                var sr = r[method]('/auth/login');
                expect(sr).to.be.an('object');
                expect(sr).to.be.an.instanceOf(superagent.Request);
                expect(sr).to.have.a.property('_timeout', 6666);
                expect(sr).to.have.a.property('url', 'http://authomator.local:3000/auth/login');
            });
        });
    })
});