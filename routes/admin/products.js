const express = require("express");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");

const router = express.Router();

//1route to list out diff products
router.get("/admin/products", (req, res) => {

});


//2route to show a form allows user to create new product
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTemplate({}));
});


//3allow this user to submit form

//4allow editing diff products

//5allow submitting/editing form

//6allow deletion of products


module.exports = router;