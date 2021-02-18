const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const {UsersModel}= require('../models/usersModel');

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
});

module.exports = router;