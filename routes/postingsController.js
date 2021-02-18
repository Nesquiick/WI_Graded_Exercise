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