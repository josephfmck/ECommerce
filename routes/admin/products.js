const express = require("express");
const { route } = require("./auth");

const router = express.Router();

//1route to list out diff products
router.get("/admin/products", (req, res) => {

});


//2route to show a form allows user to create new product
router.get("/admin/products/new", (req, res) => {

});


//3allow this user to submit form

//4allow editing diff products

//5allow submitting/editing form

//6allow deletion of products


module.exports = router;