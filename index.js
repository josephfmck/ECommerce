const express = require("express"); 
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth.js");
const productsRouter = require("./routes/admin/products");

const app = express();

//to access public folder
app.use(express.static("public"));

//BodyParser = Middleware library = does some pre-processing on the "req" and "res" objects
//Globally apply middleware to all routes, parses for all requests
app.use(bodyParser.urlencoded({ extended: true}));

//  Production Grade Authentication with Cookies
app.use(cookieSession({
    keys: ["jfkajklfksfklj"]
})); //pass in with configur obj, keys prop encrypts

app.use(authRouter); //hooks up to auth.js routes
app.use(productsRouter); //hooks up to products.js routes

app.listen(3000, () => {
    console.log("listening on port 3000");
});