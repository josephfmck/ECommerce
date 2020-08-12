const express = require("express");
const multer = require("multer"); //multer = a bodyparser that takes multipart for file inputs

//handleErrors uses validatioResult
const { handleErrors, requireAuth } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();

//upload middleware function
const upload = multer({ storage: multer.memoryStorage() });

//1route to list out diff products
router.get("/admin/products", requireAuth, async (req, res) => {
    
    const products = await productsRepo.getAll();

    res.send(productsIndexTemplate({ products: products }));

});

//2route to show a form allows user to create new product
router.get("/admin/products/new", requireAuth, (req, res) => {
    res.send(productsNewTemplate({}));
});

//3allow this user to submit form
//upload.single() from multer first parses
//then check validators
router.post("/admin/products/new",
requireAuth, 
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
//:id is any characters
router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
    console.log(req.params.id); //:id in url

    const product = await productsRepo.getOne(req.params.id);

    //if didnt find product with id
    if(!product) {
        return res.send("Product not found");
    }

    res.send(productsEditTemplate({ product: product}));
});

//5allow submitting/editing form
router.post("/admin/products/:id/edit", requireAuth, async (req, res) => {
    
});

//6allow deletion of products


module.exports = router;