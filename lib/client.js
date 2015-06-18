process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var config = require('config');
var api = require('./api');
var errors = require('./errors');
var util = require('util');

exports = module.exports = Client;


/**
 * Authomator client constructor
 * @param opts
 * @constructor
 */
function Client(opts) {

    this._opts = {
        api: "http://127.0.0.1:3001",
        timeout: 1000
    };

    config.util.extendDeep(this._opts, opts);
    config.util.setModuleDefaults('AuthomatorNodeClient', this._opts);

    this._opts = config.get('AuthomatorNodeClient');
    
    this._request = new api(this._opts);
    
}

/**
 * Export the errors
 * @type {exports|module.exports}
 */
Client.errors = errors;


/**
 * Register a new user
 * @param {String} email
 * @param {String} password
 * @param {Function} callback - receives (err, tokens)
 */
Client.prototype.signup = function signup (email, password, callback){

    var self = this;
    
    this._request
        .post('/api/auth/signup')
        .send({email: email, password: password})
        .end(function(err, res){
            if (err) {
                if (err.status === 422) {
                    if (res.body &&
                        res.body.errors &&
                        res.body.errors['identities.local.email'] &&
                        res.body.errors['identities.local.email'].kind &&
                        res.body.errors['identities.local.email'].kind === 'unique' ) {
                        return callback(new errors.UserExistsError());
                    }
                    return callback(new errors.BadParamsError(res.body.errors));
                }
                return callback(err, res);
            }
            callback(err, res.body);
        });
};


/**
 * Log in a new user
 * @param {String} email
 * @param {String} password
 * @param {Function} callback - receives (err, tokens)
 */
Client.prototype.login = function login (email, password, callback){
    
    this._request
        .post('/api/auth/login')
        .send({email: email, password: password})
        .end(function(err, res){

            if (err) {
                switch (err.status) {
                    case 401:
                        return callback(new errors.InvalidCredentials());
                    case 422:
                        return callback(new errors.BadParamsError(res.body.errors));
                    default:
                        return callback(err, res);
                }
            }
            callback(err, res.body);
        });
};


/**
 * Send and email with a reset url for the specified email addres
 * @param {String} email
 * @param {String} url
 * @param {Function} callback - receives (err)
 */
Client.prototype.sendResetMail = function (email, url, callback) {
    
    this._request
        .post('/api/auth/reset/mail')
        .send({email: email, url: url})
        .end(function(err, res){

            if (err) {
                switch (err.status) {
                    case 400:
                        return callback(new errors.NoSuchUserError());
                    case 422:
                        return callback(new errors.BadParamsError(res.body.errors));
                    default:
                        return callback(err, res);
                }
            }
            
            callback(err);
        });
};


/**
 * Reset a user password with the token recieved from the reset email
 * 
 * @param {String} password
 * @param {String} resetToken
 * @param {Function} callback
 */
Client.prototype.resetPassword = function (password, resetToken, callback) {
    
    this._request
        .post('/api/auth/reset/' + resetToken)
        .send({password: password})
        .end(function(err, res){


            if (err) {
                switch (err.status) {
                    case 400:
                        return callback(new errors.InvalidTokenError());
                    case 404:
                        return callback(new errors.NoSuchUserError());
                    case 422:
                        return callback(new errors.BadParamsError(res.body.errors));
                    default:
                        return callback(err, res);
                }
            }
            
            callback(err);
        });
};