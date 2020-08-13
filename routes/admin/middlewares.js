//reusable middleware for routes/admin

const { validationResult } = require("express-validator");


//middleware func handleErrors
module.exports = {
    //returning func, cuz want to customize handleErrors middleware with templates
    handleErrors(templateFunc, dataCallback) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            //if errors occur
            if(!errors.isEmpty()) {

                let data = {};
                if(dataCallback) {
                    data = await dataCallback(req);
                }

                return res.send(templateFunc({ errors: errors, ...data} ));
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