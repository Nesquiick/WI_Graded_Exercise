const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs'); //new module for hashing


const {PostingsModel}= require('../models/postingsModel');
const {UsersModel}= require('../models/usersModel');

// *** Authentication 
require('../auth/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../auth/jwt-key.json');
// *** 

/* Create a user with postman :
{
    "user_name":"Lucie Louatron",
    "user_email": "Lucie@test.fi",
    "user_address":"Oulu, Finland",
    "user_date_birth": "2000-06-14T01:32:09.124+00:00",
    "user_password": "oui",
    "user_comfirm_password":"oui"
}
*/
router.post('/', (req,res) => { //Create a user
    if('user_password' in req.body == false ) {
        return res.status(400).send("Missing password from body");
    }else if('user_email' in req.body == false ) {
        return res.status(400).send("Missing email from body");
    }else if('user_name' in req.body == false ) {
        return res.status(400).send("Missing name from body");
    }else if('user_address' in req.body == false ) {
        return res.status(400).send("Missing address from body");
    }else if('user_date_birth' in req.body == false ) {
        return res.status(400).send("Missing date of birth from body");
    }else if('user_comfirm_password' in req.body == false ) {
        return res.status(400).send("Missing password's confirmation from body");
    }else if(req.body.user_password!=req.body.user_comfirm_password){
        return res.status(400).send("Passwords not matching");
    }else {
        const hashedPassword = bcrypt.hashSync(req.body.user_password, 6); //hash password

        const newRecord = new UsersModel({
            user_name: req.body.user_name,
            user_email: req.body.user_email,
            user_address: req.body.user_address,
            user_date_birth: req.body.user_date_birth,
            user_password: hashedPassword
        });

        newRecord.save((err, docs) => {
            if (!err) {
                return res.status(200).send("User succesfully created : "+ docs._id);
            }
            else {
                return res.status(400).send("Error : " + err);
            }
        });
    }
});

router.get('/login',
passport.authenticate('basic', {session: false}), 
(req, res) => { // Loggin a user
    const body = {
        id: req.user._id,
        name: req.user.user_name,
        email : req.user.user_email
    };
    const payload = { user : body };
    const options= { expiresIn: '1h'}
    const token = jwt.sign(payload, jwtSecretKey.secret, options);
    return res.status(200).json({body, token});
});

router.get(
'/:id',
passport.authenticate('jwt', { session: false }), 
(req,res) => { //Get all the informations from a user
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send("ID unknown : "+ req.params.id);
    }else if(req.user.id==req.params.id){
        UsersModel.findById(
        req.params.id,
        (err,docs) => {
            if (!err) {
                return res.status(200).send(docs);
            }else{
                return res.status(400).send("Error : "+ err)
            };
        })
    }else{
        return res.status(401).send("Unauthorized");
    }
});

// This is the routes for the user's postings

router.get('/:id/postings',
(req,res) => { //Get all the postings from a user
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send("ID unknown : "+ req.params.id);
    }else{
        PostingsModel.find({seller_id: req.params.id}, (err, docs) => {
            if (!err) {
                return res.status(200).send(docs);
            }else {
                return res.status(400).send("Error to get the data: "+ err);
            }
        });
    }
});

/* Create a posting with postman :
{
    "posting_title": "titre",
    "posting_description": "description",
    "posting_category": "category",
    "posting_location": "location",
    "posting_price": 40,
    "posting_delivery_type": "Shipping"
}
*/

router.post(
'/:id/postings',
passport.authenticate('jwt', { session: false }), 
(req,res) => { //Create a posting
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send("ID unknown : "+ req.params.id);
    }else {
        if('posting_title' in req.body == false ) {
            return res.status(400).send("Missing title from body");
        }else if('posting_description' in req.body == false ) {
            return res.status(400).send("Missing description from body");
        }else if('posting_category' in req.body == false ) {
            return res.status(400).send("Missing category from body");
        }else if('posting_delivery_type' in req.body == false ) {
            return res.status(400).send("Missing delivery type from body");
        }else if('posting_location' in req.body == false ) {
            return res.status(400).send("Missing location of birth from body");
        }else if('posting_price' in req.body == false ) {
            return res.status(400).send("Missing orice from body");
        }else if(req.body.user_password!=req.body.user_comfirm_password){
            return res.status(400).send("Passwords not matching");
        }else if(req.user.id==req.params.id){
            const newRecord = new PostingsModel({
                posting_title: req.body.posting_title,
                posting_description: req.body.posting_description,
                posting_category: req.body.posting_category,
                posting_location: req.body.posting_location,
                posting_price: req.body.posting_price,
                posting_delivery_type: req.body.posting_delivery_type,
                seller_name: req.user.name, 
                seller_email: req.user.email,
                seller_id: req.user.id.toString()
            });

            newRecord.save((err, docs) => {
                if (!err) {
                    return res.status(200).send("Posting succesfully created : "+ docs._id);
                }else {
                    return res.status(400).send("Error creating new data : " + err);
                }
            });
        }else{
            return res.status(401).send("Unauthorized");
        }
    }
});


router.get('/:id_user/postings/:id_post', (req,res) => { //Get all the information of a posting for a user
    if (!ObjectID.isValid(req.params.id_user)){
        return res.status(400).send("ID unknown : "+ req.params.id_user);
    }else if (!ObjectID.isValid(req.params.id_post)){
        return res.status(400).send("ID unknown : "+ req.params.id_post);
    }else {
        function getPostingOwner(post_id, user_id){
            const query_post_owner = PostingsModel.findOne({ _id: post_id, seller_id: user_id });
            return query_post_owner;
        }
        const query_owner = getPostingOwner(req.params.id_post,req.params.id_user);
        query_owner.exec(function (err,post){
            if(err) {
                return res.status(400).send("Error : "+ err);
            }
            else if (!post) {
                return res.status(404).send("Posting not found, or you sure it is this user that post it ?");
            }
            else {
                PostingsModel.find({_id:req.params.id_post}, (err, docs) => {
                    if (!err) {
                        res.status(200).send(docs);
                    }else{
                        return res.status(400).send("Error to get the data: "+ err);
                    }
                });
            }
        });
    }
    
});

router.put(
'/:id_user/postings/:id_post',
passport.authenticate('jwt', { session: false }), 
(req,res) => { //Update the posting
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
                return res.status(404).send("Posting not found, or you sure it is this user that post it ?");
            }
            else if('posting_title' in req.body == false ) {
                return res.status(400).send("Missing title from body");
            }else if('posting_description' in req.body == false ) {
                return res.status(400).send("Missing description from body");
            }else if('posting_category' in req.body == false ) {
                return res.status(400).send("Missing category from body");
            }else if('posting_delivery_type' in req.body == false ) {
                return res.status(400).send("Missing delivery type from body");
            }else if('posting_location' in req.body == false ) {
                return res.status(400).send("Missing location of birth from body");
            }else if('posting_price' in req.body == false ) {
                return res.status(400).send("Missing orice from body");
            }else if(req.body.user_password!=req.body.user_comfirm_password){
                return res.status(400).send("Passwords not matching");
            }else if(req.user.id==req.params.id_user){
                const updateRecord = {
                    posting_title: req.body.posting_title,
                    posting_description: req.body.posting_description,
                    posting_category: req.body.posting_category,
                    posting_location: req.body.posting_location,
                    posting_price: req.body.posting_price,
                    posting_delivery_type: req.body.posting_delivery_type,
                    posting_images: req.body.posting_images,
                    seller_name: req.user.name, 
                    seller_email: req.user.email,
                    seller_id: req.user.id
                };
                PostingsModel.findByIdAndUpdate(
                    req.params.id_post,
                    {$set: updateRecord},
                    {new: true},
                    (err, docs) => {
                        if (!err) {
                            return res.status(200).send("Posting succesfully updated : "+ req.params.id_post);
                        }else {
                            return res.status(304).send("Posting not modified : "+ req.params.id_post +", reason : "+err);
                        }
                    }
                )
            }else{
                return res.status(401).send("Unauthorized");
            }
        });
    }
});


router.delete(
'/:id_user/postings/:id_post',
passport.authenticate('jwt', { session: false }), 
(req,res) => { //Delete the posting of a user/owner
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
                return res.status(404).send("Posting not found, or you sure it is this user that post it ?");
            }
            else {
                if(req.user.id==req.params.id_user){
                    PostingsModel.findByIdAndRemove(
                    req.params.id_post,
                    (err,docs) => {
                        if (!err){ 
                            return res.status(200).send("Posting succesfully deleted : "+ req.params.id_post);
                        }else{
                            return res.status(400).send("Delete error : "+ err);
                        }
                    })
                }else{
                    return res.status(401).send("Unauthorized");
                }
            }
        });
    }
});


module.exports = router;