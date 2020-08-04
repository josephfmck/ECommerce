const Repository = require("./repository");

class ProductsRepository extends Repository {

}


//create an instance to avoid repeating misstyped .json when we create new instance
module.exports = new ProductsRepository('products.json'); //save data to .json