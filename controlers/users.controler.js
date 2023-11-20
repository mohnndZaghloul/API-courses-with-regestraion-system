const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/user.model');
const appError = require('../utils/appError');
const {SUCCESS, FAIL, ERROR} = require('../utils/httpStatus');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/generateJWT');

const getUsers = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 5;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    
    const users = await User.find({}, {"__v": false, password: false}).limit(limit).skip(skip);
    res.json({status: SUCCESS, data: {users}});
});

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, role, password} = req.body;
    
    const oldUser = await User.findOne({email: email});
    if(oldUser) {
        const error = appError.create('user is already exists', 400, FAIL);
        return next(error);
    }

    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword,
        avater: req.file.filename
    });

    //generate a JWT
    const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
    newUser.token = token;

    await newUser.save();

    res.status(201).json({status: SUCCESS, data: {newUser}});
})

const login = asyncWrapper(async (req, res, next) => {
    const {email , password} = req.body;

    const user = await User.findOne({email: email});

    if(!user) {
        const error = appError.create('user not founed', 400, FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if(user && matchedPassword) {
        const token = await generateJWT({email: user.email, id: user._id, role: user.role});
        return res.status(200).json({status: SUCCESS, data: {token: token}});
    }else {
        const error = appError.create('password is wrong', 500, ERROR);
        return next(error);
    }
})

module.exports = {
    getUsers,
    register,
    login
}