//*Set of route handlers related to products that are exposed to all users of application

const express = require("express");
const productsRepo = require("../repositories/products");
const productsIndexTemplate = require("../views/products/index");

const router = express.Router();

router.get("/", async (req, res) => {
    //arr of objs
    const products = await productsRepo.getAll();

    res.send(productsIndexTemplate({ products: products}));
});

module.exports = router;