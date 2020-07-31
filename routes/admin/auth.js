const express = require("express");
//https://express-validator.github.io/docs/
//only grabbing check and validationResult functions from validator
const { check, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users.js");
const signupTemplate = require("../../views/admin/auth/signup.js");
const signinTemplate = require("../../views/admin/auth/signin.js");
//destructure prop from validators.js
const { requireEmail, requirePassword, requirePasswordConfirmation } = require("./validators");

//subrouter: is exactly like app (replaced), keeps track of route handlers
const router = express.Router();

router.get("/signup", (request, response) => {
    response.send(signupTemplate({ req: request})); //prop req = request from signup.js
});


//2nd arg arr for express-validator
router.post("/signup", 
[
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
], 
async (request, response) => {
    //console.log(request); //method: POST
    console.log(request.body);

    //Middle-Ware express-validator library attaches results of the check validation to the request handler
    const errors = validationResult(request); //gain access to those results from checks
    console.log(errors);

    //isEmpty true if no errors
    if(!errors.isEmpty()) {
        return response.send(signupTemplate({ req: request, errors: errors })); //prop req and errors = request from signup.js
    }

    //destructure
    const { email, password, passwordConfirmation } = request.body;

    //  Production Grade Authentication with Cookies
    //  Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email: email, password: password});
    
    //  Store the id of that user inside the users cookie
    // req.session prop Added by cookie session
    request.session.userId = user.id; //obj with info inside maintains session

    response.send("Account Created");
});

//sign out by removing info in their cookie
router.get('/signout', (request, response) => {
    request.session = null; //clears out current cookie session

    response.send("you are logged out");

});

router.get("/signin", (req, res) => {
    res.send(signinTemplate());
});

//validators passed in 2nd arr
router.post("/signin",
    [
        check("email")
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Must provide valid email")
            .custom(async (email) => {
                const user = await usersRepo.getOneBy({email: email});
                if(!user) {
                    throw new Error("Email not found");
                }
            }),
        check("password")
            .trim()
    ], 
    async (req,res) => {
        const errors = validationResult(req); //gain access to those results from checks
        console.log(errors);

        const { email, password } = req.body;

        //find one with email provided
        const user = await usersRepo.getOneBy({ email: email});

        //if no user
        if(!user) {
            return res.send("email not found");
        }

        //T/F of comparision passwords
        const validPassword = await usersRepo.comparePasswords(
            user.password,
            password
        );

        //if users pass !== password provided
        if(!validPassword) {
            return res.send("invalid password");
        }
        //set to id of user from database
        //successfully signed in
        req.session.userId = user.id;

        res.send("you are signed in");
});


module.exports = router; //make route handler available