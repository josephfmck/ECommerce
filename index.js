const express = require("express"); 

const app = express();

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
    response.send("Account Created");
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});