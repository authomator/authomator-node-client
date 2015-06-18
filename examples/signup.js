var Authomator = require('../lib');

//
// in production ensure you connect over https !!
//  
var auth = new Authomator({api: 'http://127.0.0.1:3001/api'});

auth.signup('test@test.local', 'thepassword', function(err, tokens){

    if (err) {

        console.log('User signup failed...');

        switch(err.name) {
            case 'UserExistsError':
                console.log('The email is already used');
                break;
            case 'BadParamsError':
                console.log('The email/password are not valid');
                console.log(err.errors);
                break;
            default:
                console.log('An unexpected error occured');
                console.log(err);
        }
        return;
    }

    console.log('User succesfully registered');
    console.log('identity token', tokens.it);
    console.log('access token', tokens.at);
    console.log('refresh token', tokens.rt);
});
