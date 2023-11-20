const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatus");

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)) {
            return next(appError.create('this role does not allowed to delete', 401, ERROR));
        }
        next();
    }
}