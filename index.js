const express = require("express"); 
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

const app = express();

//BodyParser = Middleware library = does some pre-processing on the "req" and "res" objects
//Globally apply middleware to all routes, parses for all requests
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (request, response) => {
    response.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="password confirmation"/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});


app.post("/", async (request, response) => {
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

    //  Producation Grade Authentication with Cookies
    //  Create a user in our user repo to represent this person
    await usersRepo.create({ email: email, password: password});
    
    //  Store the id of that user inside the users cookie

    response.send("Account Created");
});




app.listen(3000, () => {
    console.log("listening on port 3000");
});