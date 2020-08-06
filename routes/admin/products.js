const express = require("express");
const { validationResult } = require("express-validator");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();

//1route to list out diff products
router.get("/admin/products", (req, res) => {

});

//3allow this user to submit form
router.post("/admin/products/new", 
[
    requireTitle,
    requirePrice
], 
(req, res) => {
    //gain access to errors results from checks
    const errors = validationResult(req);

    console.log(errors);
    res.send("submitted");
});

//2route to show a form allows user to create new product
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTemplate({}));
});


//4allow editing diff products

//5allow submitting/editing form

//6allow deletion of products


module.exports = router;