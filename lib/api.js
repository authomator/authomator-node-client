process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var config = require('config');
var superagent = require('superagent');
var url = require('url');

exports = module.exports = function ApiRequest(opts) {

    this._opts = {
        api: 'http://localhost:3001/api/',
        timeout: 1000
    };

    config.util.extendDeep(this._opts, opts);
};


['post', 'get', 'put', 'delete'].forEach(function(method){
        
    exports.prototype[method] = function(uri) {

        agent = new superagent.Request(
            method.toUpperCase(),
            url.resolve(this._opts.api, uri)
            
        )   .timeout(this._opts.timeout)
            .type('json');
        return agent;
    };
});