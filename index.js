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
    //data event when data passed in
    request.on("data", data => {
        //data = buffer obj raw info hex vals, converted to utf8, then parsed into arr with split
        const parsed = data.toString("utf8").split("&");
        const formData = {};
        for (let pair of parsed) {
            //1st el assign to key, 2nd el assign to value
            const [key, value] = pair.split("=");
            console.log(key, value);
            formData[key] = value;
        }
        console.log(formData); 
    });

    response.send("Account Created");
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});