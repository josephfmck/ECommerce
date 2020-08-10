const express = require("express");
const multer = require("multer"); //multer = a bodyparser that takes multipart for file inputs

//handleErrors uses validatioResult
const { handleErrors } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();

//upload middleware function
const upload = multer({ storage: multer.memoryStorage() });

//1route to list out diff products
router.get("/admin/products", async (req, res) => {
    const products = await productsRepo.getAll();

    res.send(productsIndexTemplate({ products: products }));

});

//2route to show a form allows user to create new product
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTemplate({}));
});

//3allow this user to submit form
//upload.single() from multer first parses
//then check validators
router.post("/admin/products/new", 
upload.single("image"),
[
    requireTitle,
    requirePrice
], 
handleErrors(productsNewTemplate),
async (req, res) => {

    //multer bodyparser middleware
    //multipart/form-data breaks input into chunks, "title", "image"
    console.log(req.file.buffer); //raw img data
    
    const image = req.file.buffer.toString("base64"); //img in string format
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image});

    res.redirect("/admin/products");
});


//4allow editing diff products

//5allow submitting/editing form

//6allow deletion of products


module.exports = router;