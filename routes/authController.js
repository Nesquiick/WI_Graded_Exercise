const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

// *** Authentication 

const bcrypt = require('bcryptjs'); //new module for hashing
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecretKey = require('../auth/jwt-key.json');

let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecretKey.secret;
// ***


/*
{
    "user_name":"Lucie Louatron",
    "user_email": "Lucie@test.fi",
    "user_address":"Oulu, Finland",
    "user_date_birth": "2000-06-14T01:32:09.124+00:00",
    "user_password": "oui",
    "user_comfirm_password":"oui"
}
*/

router.post('/', function (req, res) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(user, jwtSecretKey);
           return res.json({user, token});
        });
    })(req, res);
});

module.exports = router;