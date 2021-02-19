const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;


const {UsersModel}= require('../models/usersModel');
const {PostingsModel}= require('../models/postingsModel');

router.post('/', (req,res) => { //Create a user
    const newRecord = new UsersModel({
        user_username: req.body.user_username,
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_address:req.body.user_address,
        user_date_birth:req.body.user_date_birth,
        user_password:req.body.user_password
    });

    newRecord.save((err, docs) => {
        if (!err) res.send(docs);
        else 
            console.log("Error creating new data : "+ err);
            return res.status(400).send("Error, your email or your username may already be used");
    });
});

router.get('/:id', (req,res) => { //Get all the informations from a user
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);

    UsersModel.findById(
        req.params.id,
        (err,docs) => {
            if (!err) res.send(docs);
            else console.log("Delete error : " + err);
    })
});

router.post('/:id/postings', (req,res) => { //Create a posting
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);

    const seller_name = UsersModel.find({}, req.params.id).select('user_name');

    const seller_email = UsersModel.find({}, req.params.id).select('user_email');
    
    const newRecord = new PostingsModel({
        posting_title: req.body.posting_title,
        posting_description: req.body.posting_description,
        posting_category: req.body.posting_category,
        posting_location:req.body.posting_location,
        posting_price:req.body.posting_price,
        posting_delevery_type:req.body.posting_delevery_type,
        posting_images:req.body.posting_images,
        posting_seller:{
            seller_name: seller_name.user_name,
            seller_email: seller_email.user_email,
            seller_id: req.params.id
        }
    });
    
    newRecord.save((err, docs) => {
        if (!err) res.send(docs);
        else 
            console.log("Error creating new data : "+ err);
            return res.status(400).send("Error creating new data");
    });
});

module.exports = router;

/*
router.put('/:id', (req,res) => { //Update the user informations
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);

    const updateRecord = {
        user_username: req.body.user_username,
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_address:req.body.user_address,
        user_date_birth:req.body.user_date_birth,
        user_password:req.body.user_password
    };

    UsersModel.findByIdAndUpdate(
        req.params.id,
        {$set: updateRecord},
        {new: true},
        (err, docs) => {
            if (!err) res.send(docs);
            else HTMLFormControlsCollection.log("Update error : "+ err);
        }
    )
})

router.delete('/:id', (req,res) => { //Delete the user
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);

    UsersModel.findByIdAndRemove(
        req.params.id,
        (err,docs) => {
            if (!err) res.send(docs);
            else console.log("Delete error : " + err);
    })
});*/