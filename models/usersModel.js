//Model of the users table
const mongoose = require('mongoose');

const UsersModel = mongoose.model(
    "users",
    {
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
    }
);

module.exports = {UsersModel};