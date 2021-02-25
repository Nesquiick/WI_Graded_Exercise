// Authentification :
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwtSecretKey = require('./jwt-key.json');
const {UsersModel}= require('../models/usersModel');
const bcrypt = require('bcryptjs'); //new module for hashing


passport.use(new BasicStrategy( //login
    {
        usernameField: 'user_email',    // define the parameter in req.body that passport can use as username and password
        passwordField: 'user_password'
    },
    function(username, password, cb) {
        UsersModel.findOne({ user_email: username }, function(err, user) {
            if (err) { return cb(err); }
            if (!user) {
                return cb(null, false, { message: 'Incorrect username.' });
            }
            if (! bcrypt.compareSync(password, user.user_password)) {
                return cb(null, false, { message: 'Incorrect password.' });
            }
            return cb(null, user.toJSON());
        });
    }
));

let options = {}
/* Configure the passport-jwt module to expect JWT in headers from Authorization field as Bearer token */
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
/* This is the secret signing key.You should NEVER store it in code  */
options.secretOrKey = jwtSecretKey.secret;

passport.use(new JWTStrategy(options,
    function(jwt_payload, done) {
    /*
    console.log("Processing JWT payload for token content:");
    console.log(jwt_payload);
    */
    /* Here you could do some processing based on the JWT payload.For example check if the key is still valid based on expires property.*/
    const now = Date.now() / 1000;
    if(jwt_payload.exp > now) {
        done(null, jwt_payload.user);
    }
    else {  // expired
        done(null, false);
    }
}));