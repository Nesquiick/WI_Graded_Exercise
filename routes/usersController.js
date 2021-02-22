const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const {PostingsModel}= require('../models/postingsModel');
const {UsersModel}= require('../models/usersModel');

// *** Authentication 

const bcrypt = require('bcryptjs'); //new module for hashing
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../auth/jwt-key.json');

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

router.post('/login', function (req, res, done) { // Login a user
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
           const token = jwt.sign(user, jwtSecretKey.secret);
           return res.json({user, token});
        });
    })(req, res);
});

module.exports = router;

router.post('/', (req,res) => { //Create a user
    if('user_password' in req.body == false ) {
        return res.status(400).send("Missing password from body");
    }
    if('user_email' in req.body == false ) {
        return res.status(400).send("Missing email from body");
    }
    if('user_name' in req.body == false ) {
        return res.status(400).send("Missing name from body");
    }
    if('user_address' in req.body == false ) {
        return res.status(400).send("Missing address from body");
    }
    if('user_date_birth' in req.body == false ) {
        return res.status(400).send("Missing date of birth from body");
    }
    if('user_comfirm_password' in req.body == false ) {
        return res.status(400).send("Missing password's confirmation from body");
    }
    if(req.body.user_password!=req.body.user_comfirm_password){
        return res.status(400).send("Passwords not matching");
    }

    const hashedPassword = bcrypt.hashSync(req.body.user_password, 6); //hash password

    const newRecord = new UsersModel({
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_address: req.body.user_address,
        user_date_birth: req.body.user_date_birth,
        user_password: hashedPassword
    });

    newRecord.save((err, docs) => {
        if (!err) return res.status(200).send("User succesfully created : "+ docs._id);
        else 
            console.log("Error creating new data : "+ err);
            return res.status(400).send("Error : " + err);
    });
});

router.get('/:id',passport.authenticate('jwt', { session: false }), (req,res) => { //Get all the informations from a user
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);

    UsersModel.findById(
        req.params.id,
        (err,docs) => {
            if (!err) res.status(200).send(docs);
            else console.log("Error : " + err);
    })
});

// This is the routes for the user's postings

router.get('/:id/postings', (req,res) => { //Get all the postings from a user
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);
    
    PostingsModel.find({seller_id: req.params.id}, (err, docs) => {
        if (!err) res.status(200).send(docs);
        else console.log("Error to get data : "+ err);
    });
});

router.post('/:id/postings', (req,res) => { //Create a posting
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);
    else {
        function getOwner(id){
            const query_owner = UsersModel.findOne({ _id: id});
            return query_owner;
        }
            
        const query_owner = getOwner(req.params.id);
        query_owner.exec(function (err,user){
            if(err) {
                console.log("Error : "+ err);
            }
            else {
                const newRecord = new PostingsModel({
                    posting_title: req.body.posting_title,
                    posting_description: req.body.posting_description,
                    posting_category: req.body.posting_category,
                    posting_location: req.body.posting_location,
                    posting_price: req.body.posting_price,
                    posting_delivery_type: req.body.posting_delivery_type,
                    posting_images: req.body.posting_images,
                    seller_name: user.user_name, 
                    seller_email: user.user_email,
                    seller_id: user._id.toString()
                });

                newRecord.save((err, docs) => {
                    if (!err) res.status(200).send("Posting succesfully created : "+ docs._id);
                    else {
                        return res.status(400).send("Error creating new data");
                    }
                });
            }
        });
    }
});

router.get('/:id_user/postings/:id_post', (req,res) => { //Get all the information of a posting for a user
    if (!ObjectID.isValid(req.params.id_user))
        return res.status(400).send("ID unknown : "+ req.params.id_user);
    else if (!ObjectID.isValid(req.params.id_post))
        return res.status(400).send("ID unknown : "+ req.params.id_post);
    else {
        function getPostingOwner(post_id, user_id){
            const query_post_owner = PostingsModel.findOne({ _id: post_id, seller_id: user_id });
            return query_post_owner;
        }
        const query_owner = getPostingOwner(req.params.id_post,req.params.id_user);
        query_owner.exec(function (err,post){
            if(err) {
                console.log("Error : "+ err);
            }
            else if (!post) {
                return res.status(401).send("Unauthorized");
            }
            else {
                PostingsModel.find({_id:req.params.id_post}, (err, docs) => {
                    if (!err) res.status(200).send(docs);
                    else console.log("Error to get data : "+ err);
                });
            }
        });
    }
    
});

router.put('/:id_user/postings/:id_post', (req,res) => { //Update the posting
    if (!ObjectID.isValid(req.params.id_user))
        return res.status(400).send("ID unknown : "+ req.params.id_user);
    else if (!ObjectID.isValid(req.params.id_post))
        return res.status(400).send("ID unknown : "+ req.params.id_post);
    else {
        function getPostingOwner(post_id, user_id){
            const query_post_owner = PostingsModel.findOne({ _id: post_id, seller_id: user_id });
            return query_post_owner;
        }
        const query_owner = getPostingOwner(req.params.id_post,req.params.id_user);
        query_owner.exec(function (err,post){
            if(err) {
                console.log("Error : "+ err);
            }
            else if (!post) {
                return res.status(401).send("Unauthorized");
            }
            else {
                const updateRecord = {
                    posting_title: req.body.posting_title,
                    posting_description: req.body.posting_description,
                    posting_category: req.body.posting_category,
                    posting_location: req.body.posting_location,
                    posting_price: req.body.posting_price,
                    posting_delivery_type: req.body.posting_delivery_type,
                    posting_images: req.body.posting_images,
                    seller_name: post.seller_name, 
                    seller_email: post.seller_email,
                    seller_id: req.params.id_user
                };
                PostingsModel.findByIdAndUpdate(
                    req.params.id_post,
                    {$set: updateRecord},
                    {new: true},
                    (err, docs) => {
                        if (!err) res.status(200).send("Posting succesfully updated : "+ req.params.id_post);
                        else res.status(304).send("Posting not modified : "+ req.params.id_post +", reason : "+err);
                    }
                )
            }
        });
    }
});

router.delete('/:id_user/postings/:id_post', (req,res) => { //Delete the posting of a user/owner
    if (!ObjectID.isValid(req.params.id_user))
        return res.status(400).send("ID unknown : "+ req.params.id_user);
    else if (!ObjectID.isValid(req.params.id_post))
        return res.status(400).send("ID unknown : "+ req.params.id_post);
    else {
        function getPostingOwner(post_id, user_id){
            const query_post_owner = PostingsModel.findOne({ _id: post_id, seller_id: user_id });
            return query_post_owner;
        }
        const query_owner = getPostingOwner(req.params.id_post,req.params.id_user);
        query_owner.exec(function (err,post){
            if(err) {
                console.log("Error : "+ err);
            }
            else if (!post) {
                return res.status(401).send("Unauthorized");
            }
            else {
                PostingsModel.findByIdAndRemove(
                    req.params.id_post,
                    (err,docs) => {
                        if (!err) res.status(200).send("Posting succesfully deleted : "+ req.params.id_post);
                        else console.log("Delete error : " + err);
                })
            }
        });
    }
});



module.exports = router;