const express = require("express"); 

const app = express();

app.get("/", (request, response) => {
    response.send("hi there");
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});