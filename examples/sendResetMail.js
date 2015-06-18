var Authomator = require('../lib');

//
// in production ensure you connect over https !!
//  
var auth = new Authomator({api: 'http://127.0.0.1:3001/api'});

auth.signup('stefan@lapers.be', 'thepassword', function(err, tokens){

    if (err) {

        console.log('User signup failed...');

        switch(err.name) {
            case 'UserExistsError':
                console.log('The email is already used');
                break;
            case 'BadParamsError':
                console.log('The email/password are not valid');
                console.log(err.errors);
                return;
                break;
            default:
                console.log('An unexpected error occured');
                console.log(err);
                return;
        }

    }


    auth.sendResetMail('stefan@lapers.be', 'https://127.0.0.1', function(err, tokens){

        if (err) {

            console.log('Sent reset mail failed...');

            switch (err.name) {
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
            console.log('Sent reset mail success...');
        }

    });

});
