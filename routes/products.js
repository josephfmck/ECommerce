//*Set of route handlers related to products that are exposed to all users of application

const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    res.send("Products!!");
});

module.exports = router;