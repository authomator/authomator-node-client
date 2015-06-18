exports = module.exports;


function UserExistsError() {
    Error.call(this);
    this.name = "UserExistsError";
    this.message = 'User already exists';
}
UserExistsError.prototype = Error.prototype;
exports.UserExistsError = UserExistsError;


function NoSuchUserError() {
    Error.call(this);
    this.name = "NoSuchUserError";
    this.message = 'User does not exist';
}
NoSuchUserError.prototype = Error.prototype;
exports.NoSuchUserError = NoSuchUserError;


function BadParamsError(errors) {
    Error.call(this);
    this.name = "BadParamsError";
    this.message = 'Bad parameters';
    this.errors = errors;
}
BadParamsError.prototype = Error.prototype;
exports.BadParamsError = BadParamsError;


function InvalidCredentialsError() {
    Error.call(this);
    this.name = "InvalidCredentialsError";
    this.message = 'Invalid credentials';
}
InvalidCredentialsError.prototype = Error.prototype;
exports.InvalidCredentials = InvalidCredentialsError;


function InvalidTokenError() {
    Error.call(this);
    this.name = "InvalidTokenError";
    this.message = 'The token specified is invalid';
}
InvalidTokenError.prototype = Error.prototype;
exports.InvalidTokenError = InvalidTokenError;