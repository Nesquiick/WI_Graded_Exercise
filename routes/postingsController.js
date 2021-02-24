// In this files the path for search the postings based on location, category and date is missing.

const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const {PostingsModel}= require('../models/postingsModel');

router.get('/', (req,res) => { //Get all the postings
    PostingsModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data : "+ err);
    });
});

router.get('/:id', (req,res) => { //Get all the informations for a posting
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : "+ req.params.id);

    PostingsModel.findById(
        req.params.id,
        (err,docs) => {
            if (!err) res.send(docs);
            else console.log("Delete error : " + err);
    })
});

module.exports = router;
