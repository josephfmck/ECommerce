//reusable middleware for routes/admin

const { validationResult } = require("express-validator");


//middleware func handleErrors
module.exports = {
    //returning func, cuz want to customize handleErrors middleware with templates
    handleErrors(templateFunc) {
        return (req, res, next) => {
            const errors = validationResult(req);

            //if errors occur
            if(!errors.isEmpty()) {
                return res.send(templateFunc({ errors: errors}));
            }

            next(); //call next middleware/invoke router handler
        };
    },
    //not returning a func, no customization required
    requireAuth(req, res, next) {
        //if no userId means not signed in 
        if(!req.session.userId) {
            return res.redirect("/signin");
        }

        next(); //run next middleware/routehandler
    }
};