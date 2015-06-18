var Authomator = require('../lib');

//
// in production ensure you connect over https !!
//  
var auth = new Authomator({api: 'http://127.0.0.1:3001/api'});

auth.resetPassword('test@local.test', 'sometoken', function(err, tokens){

    if (err) {

        console.log('Sent reset mail failed...');

        switch (err.name) {
            case 'InvalidTokenError':
                console.log('Token is invalid');
                break;
            case 'NoSuchUserError':
                console.log('User does not exist');
                break;
            case 'BadParamsError':
                console.log('The email/url are not valid');
                console.log(err.errors);
                break;
            default:
                console.log('An unexpected error occured');
                console.log(err);
        }
    }
    else {
        console.log('Password was succesfully reset');
    }
});
