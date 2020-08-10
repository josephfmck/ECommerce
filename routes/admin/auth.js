const express = require("express");
//https://express-validator.github.io/docs/
//only grabbing check and validationResult functions from validator
const { handleErrors } = require("./middlewares");

const usersRepo = require("../../repositories/users.js");
const signupTemplate = require("../../views/admin/auth/signup.js");
const signinTemplate = require("../../views/admin/auth/signin.js");
//destructure prop from validators.js
const { 
    requireEmail, 
    requirePassword, 
    requirePasswordConfirmation, 
    requireEmailExists,
    requireValidPasswordForUser    
} = require("./validators");

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
handleErrors(signupTemplate), 
async (request, response) => {
    //destructure
    const { email, password } = request.body;

    //  Production Grade Authentication with Cookies
    //  Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email: email, password: password});
    
    //  Store the id of that user inside the users cookie
    // req.session prop Added by cookie session
    request.session.userId = user.id; //obj with info inside maintains session

    response.redirect("/admin/products");
});

//sign out by removing info in their cookie
router.get('/signout', (request, response) => {
    request.session = null; //clears out current cookie session

    response.send("you are logged out");

});

router.get("/signin", (req, res) => {
    res.send(signinTemplate({})); //pass in empty obj so we can destructure errors in signin.js
});

//validators passed in 2nd arr
//exports come from validators.js
router.post("/signin",
    [
        requireEmailExists,
        requireValidPasswordForUser
    ],
    handleErrors(signinTemplate), 
    async (req,res) => {
        const { email } = req.body;

        //find one with email provided
        const user = await usersRepo.getOneBy({ email: email});

        //set to id of user from database
        //successfully signed in
        req.session.userId = user.id;

        res.redirect("/admin/products");
});


module.exports = router; //make route handler available