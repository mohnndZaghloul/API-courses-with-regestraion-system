require('dotenv').config();
const express = require('express');
const path = require('path');

const cors = require('cors');
const app = express();

app.use('/uploads', express.static(path.join(__dirname,'uploads')))
const { ERROR } = require('./utils/httpStatus');

const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log('mongoose connected');
});

app.use(cors());
app.use(express.json());

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

//global middleware for not found router
app.all('*', (req, res, next) => {
    return res.status(404).json({status: ERROR, message: 'This resource is not available'})
})
//global error handler
app.use((error, req, res, next) => {
    console.log(error.message);
    res.status(error.statusCode || 500).json({status: error.statusText || ERROR, message: error.message, code: error.statusCode || 500, data: null});
})

app.listen(process.env.PORT, () => {
    console.log('listening on port 5000 ...');
})