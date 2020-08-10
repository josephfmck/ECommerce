const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer"); //multer = a bodyparser that takes multipart for file inputs

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();

//upload middleware function
const upload = multer({ storage: multer.memoryStorage() });

//1route to list out diff products
router.get("/admin/products", (req, res) => {

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
async (req, res) => {
    //gain access to errors results from checks
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.send(productsNewTemplate({ errors: errors }));
    }

    //multer bodyparser middleware
    //multipart/form-data breaks input into chunks, "title", "image"
    console.log(req.file.buffer); //raw img data
    
    const image = req.file.buffer.toString("base64"); //img in string format
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image});

    res.send("submitted");
});


//4allow editing diff products

//5allow submitting/editing form

//6allow deletion of products


module.exports = router;