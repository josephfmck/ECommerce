const express = require("express"); 
const bodyParser = require("body-parser");

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


app.post("/", (request, response) => {
    //console.log(request); //method: POST
    console.log(request.body);

    response.send("Account Created");
});




app.listen(3000, () => {
    console.log("listening on port 3000");
});