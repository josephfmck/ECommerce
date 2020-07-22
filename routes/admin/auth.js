const express = require("express");
const usersRepo = require("../../repositories/users.js");

//subrouter: is exactly like app (replaced), keeps track of route handlers
const router = express.Router();

router.get("/signup", (request, response) => {
    response.send(`
        <div>
            Your id is: ${request.session.userId}
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="password confirmation"/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});


router.post("/signup", async (request, response) => {
    //console.log(request); //method: POST
    console.log(request.body);

    //destructure
    const { email, password, passwordConfirmation } = request.body;

    //SIGN UP VALIDATION
    //if someone has signed up with given email 
    const existingUser = await usersRepo.getOneBy({ email: email}); //where email: destructured email provided
    if(existingUser) {
        return response.send("Email already in use");
    }

    //Password Signup Validation 
    if(password !== passwordConfirmation) {
        return response.send("Passwords must match");
    }

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
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <button>Sign In</button>
        </form>
    </div>
    `);
});

router.post("/signin", async (req,res) => {
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