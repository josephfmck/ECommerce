const express = require("express"); 
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

//BodyParser = Middleware library = does some pre-processing on the "req" and "res" objects
//Globally apply middleware to all routes, parses for all requests
app.use(bodyParser.urlencoded({ extended: true}));

//  Production Grade Authentication with Cookies
app.use(cookieSession({
    keys: ["jfkajklfksfklj"]
})); //pass in with configur obj, keys prop encrypts


app.get("/signup", (request, response) => {
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


app.post("/signup", async (request, response) => {
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
app.get('/signout', (request, response) => {
    request.session = null; //clears out current cookie session

    response.send("you are logged out");

});

app.get("/signin", (req, res) => {
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

app.post("/signin", async (req,res) => {

});

app.listen(3000, () => {
    console.log("listening on port 3000");
});