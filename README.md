Authomator-node-client
======================


This is a nodejs rest client for the authomator-api

 

Dependencies
------------

-   superagent

-   a running authomator-api service

 

 

Creating an instance of the client
==================================

 

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var Authomator = require('authomator-client');

var authomator = new Authomator({api: 'https://127.0.0.1:3000/api'});

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 

 

Registering new users
=====================

 

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var Authomator = require('authomator-client');

//
// in production ensure you connect over https
//
var auth = new Authomator({api: 'https://127.0.0.1:3001/api'});

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


// When succesfull, the output will look something like:

User succesfully registered
identity token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZGVudGl0aWVzIjp7ImxvY2FsIjp7ImVtYWlsIjoidGVzdEB0ZXN0LmxvY2FsIn19LCJzdWIiOiI1NTgwMzQ4NGU5OWYyYTZhMTM1YTIwNGMiLCJpYXQiOjE0MzQ0NjU0MTIsImV4cCI6MTQzNDQ2OTAxMiwiYXVkIjoiYXV0aG9tYXRvci1hdWRpZW5jZSIsImlzcyI6ImF1dGhvbWF0b3IifQ.bisF168whUTZrbvTVB9JNeiphFvLckkQUvTjTgfcSnQFOdtDLdjSYIxNjY6DzTQdT1xJNfWruTIPbNKVoe8QZw
access token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1NTgwMzQ4NGU5OWYyYTZhMTM1YTIwNGMiLCJpYXQiOjE0MzQ0NjU0MTIsImV4cCI6MTQzNDQ2OTAxMiwiYXVkIjoiYXV0aG9tYXRvci1hdWRpZW5jZSIsImlzcyI6ImF1dGhvbWF0b3IifQ.hq9qSm47GKKNOje_6wnUluHE4pqkX44x9UKjVh63ijg7UIYTismeXxhV_UZpmaaU5LL1N0ZLbdPjmYZejIJs0w
refresh token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1NTgwMzQ4NGU5OWYyYTZhMTM1YTIwNGMiLCJpYXQiOjE0MzQ0NjU0MTIsImV4cCI6MTQzNDQ2OTAxMiwiYXVkIjoiYXV0aG9tYXRvciNyZWZyZXNoIiwiaXNzIjoiYXV0aG9tYXRvciJ9.ewnHNu7_O8EOqelYREl5STsa-0PKBSOBLXRlF5A_mpC4VNbA5suTJDt0pdTDPDaSnXa7On-xdocu_VrvQPbRgA

// Example output when an invalid email is send:

User signup failed...
The email/password are not valid
{ email: 
   { message: '"email" must be a valid email',
     kind: 'string.email',
     path: 'email' } }

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
