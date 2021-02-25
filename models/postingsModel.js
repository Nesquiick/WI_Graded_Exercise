//Model of the postings table
const mongoose = require('mongoose');

const PostingsModel = mongoose.model(
    "postings",
    {
        "posting_title" :{
            type: String,
            required: true
        },
        "posting_description":{
            type: String,
            required: true
        },
        "posting_category":{
            type: String,
            required: true
        },
        "posting_location":{
            type: String,
            required: true
        },
        "posting_price":{
            type: Number,
            required: true
        },
        "posting_date":{
            type: Date,
            default:Date.now
        },
        "posting_delivery_type":
        {
            type: String,
            required: true
        },
        "posting_images":
        {
            type: Array,
            default: [],
            items : {
                type : String,
                examples : 
                [
                    "./data/datatime/image1.jpg",
                    "./data/datatime/image2.jpg",
                    "./data/datatime/image3.jpg"
                ]
            }
        },
        "seller_name":{
            type: String,
            required: true
        },
        "seller_email":{
            type: String,
            required: true
        },
        "seller_id":{
            type: String,
            required: true
        }
    }
);

module.exports = {PostingsModel};