const layout = require("../layout");
const { getError } = require("../../helpers");


//function called with obj containing errors prop when we try to create product
module.exports = ({ errors }) => {
    //enctype changed to get full image info
    //multipart sends each input as parts
    return layout({
        content: `
            <form method="POST" enctype="multipart/form-data">
                <input placeholder="Title" name="title">
                ${getError(errors, 'title')}
                <input placeholder="Price" name="price">
                ${getError(errors, 'price')}
                <input type="file" name="image">
                <button>Submit</button> 
            </form>

        `
    });
};