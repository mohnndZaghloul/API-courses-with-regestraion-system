const jwt = require('jsonwebtoken');
const { FAIL } = require('../utils/httpStatus');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Aurhorization'] || req.headers['aurhorization'];
    if(!authHeader) {
        return res.status(401).json({status: FAIL, user: 'user is not found'})
    }

    const token = authHeader.split(' ')[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        return next()
    } catch (error) {
        return res.status(401).json({status: FAIL, user:'invalid token'});
    }
}

module.exports = verifyToken;

