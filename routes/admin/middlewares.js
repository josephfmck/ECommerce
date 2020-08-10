//reusable middleware for routes/admin

const { validationResult } = require("express-validator");


//middleware func handleErrors
module.exports = {
    handleErrors(templateFunc) {
        return (req, res, next) => {
            const errors = validationResult(req);

            //if errors occur
            if(!errors.isEmpty()) {
                return res.send(templateFunc({ errors: errors}));
            }

            next(); //call next middleware/invoke router handler
        };
    }
};