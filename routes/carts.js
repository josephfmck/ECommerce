const express = require("express");
const cartsRepo = require("../repositories/carts.js");

const router = express.Router();

// Receive a POST request to add an item to a cart
router.post("/cart/products", async (req, res) => {
    console.log(req.body.productId);
    
    // Figure out the cart
        //req.session = cookie session
    let cart;
    if (!req.session.cartId) {
        // We dont have a cart, we need to create one
        // and store the cart id on the req.session.cartId cart prop
        cart = await cartsRepo.create({ items: [] });

        req.session.cartId = cart.id;
    } else {
        // We have a cart! Lets get it from the repo
        cart = await cartsRepo.getOne(req.session.cartId);
    }


    // Either increment quantity for existing product
    //OR add new product to item array
    console.log(cart);

    res.send("Product added to cart");
});

//  Receive a GET request to show all items in cart

//  Receive a POST request to delete and item from a cart

module.exports = router;