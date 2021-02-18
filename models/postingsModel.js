const mongoose = require('mongoose');

const PostingsModel = mongoose.model(
    "API_graded_exercise",
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
        "posting_delevery_type":
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
                default :"",
                examples : 
                [
                    "./data/datatime/image1.jpg",
                    "./data/datatime/image2.jpg",
                    "./data/datatime/image3.jpg"
                ]
            }
        },
        "posting_seller":
        {
            type: Object,
            required: true,
            required: ["seller_name","seller_email"],
            properties : {
                "seller_name":{
                    type: String
                },
                "seller_email":{
                    type: String
                },
            }
        }
    },
    "postings"
);

module.exports = {PostingsModel};