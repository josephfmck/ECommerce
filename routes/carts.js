const express = require("express");
const cartsRepo = require("../repositories/carts.js");

const router = express.Router();

// Receive a POST request to add an item to a cart
router.post("/cart/products", async (req, res) => {
    console.log(req.body.productId);
    
    // Cart
        //req.session = cookie session
    let cart;
    if (!req.session.cartId) {
        // Starting with no cart: Create one Cart
        // and store the cart id on the req.session.cartId cart prop
        cart = await cartsRepo.create({ items: [] });

        req.session.cartId = cart.id;
    } else {
        // We have a cart. Get it from the repo
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    console.log(cart);

    //Create existing item with id
    //Callback needs NO CURLY BRACES for quantity to increment
    const existingItem = cart.items.find((item) => item.id === req.body.productId);

    if(existingItem) {
        // Increment quantity for existing product and save cart
        existingItem.quantity++;
    } else {
        // Add new product id to items array
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.send("Product added to cart");
});

//  Receive a GET request to show all items in cart

//  Receive a POST request to delete and item from a cart

module.exports = router;