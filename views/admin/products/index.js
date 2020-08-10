const layout = require("../layout");

//all products we have
module.exports = ({ products }) => {    
    //create individual html then join them
    const renderedProducts = products.map((product) => {
        return `
            <div>${product.title}</div>
        `;
    }).join("");

    return layout({
        content: `
            <h1 class="title">Products</h1>
            ${renderedProducts}
        ` 
    });
};