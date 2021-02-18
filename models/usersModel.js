const mongoose = require('mongoose');

const UsersModel = mongoose.model(
    "API_graded_exercise",
    {
        "user_username" :{
            type: String,
            unique:true,
            required: true
        },
        "user_name":{
            type: String,
            required: true
        },
        "user_date_birth":{
            type: Date,
            required: true
        },
        "user_address":{
            type: String,
            required: true
        },
        "user_email":{
            type: String,
            unique:true,
            required: true
        },
        "user_password":{
            type: String,
            required: true
        }
    },
    "users"
);

module.exports = {UsersModel};