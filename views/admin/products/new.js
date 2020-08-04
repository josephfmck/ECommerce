const layout = require("../layout");
const { getError } = require("../../helpers");


//function called with obj containing errors prop when we try to create product
module.exports = ({ errors }) => {
    return layout({
        content: `
            <form method="POST">
                <input placeholder="Title" name="title>
                <input placeholder="price" name="price">
                <input type="file" name="image">
                <button>Submit</button> 
            </form>

        `
    });
};