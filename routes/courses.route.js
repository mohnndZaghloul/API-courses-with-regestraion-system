const express = require('express');
const router = express.Router();

const { validationSchema } = require('../middleware/validation.course');
const {getAllCourses, getCourse, addCourse, updateCourse, deleteCourse} = require('../controlers/courses.controler');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowTo');
const { ADMIN, MANAGER } = require('../utils/userRules');

//get all courses and add new course
router.route('/')
        .get(getAllCourses)
        .post( validationSchema(), allowedTo(ADMIN, MANAGER), addCourse);

// get,delete or update course by id
router.route('/:courseID')
        .get(getCourse)
        .delete(verifyToken, allowedTo(ADMIN, MANAGER), deleteCourse)
        .patch( validationSchema() , updateCourse);

module.exports = router;