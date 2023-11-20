const mongoose = require('mongoose');
const validator = require('validator');
const { USER, ADMIN, MANAGER } = require('../utils/userRules');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Must filed by valid email address']
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [USER, ADMIN, MANAGER],
        default: USER
    },
    avatar: {
        type: String,
        default: 'uploads/profile.jpg'
    }
})

module.exports = mongoose.model('User', userSchema);