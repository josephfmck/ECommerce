const layout = require("../layout");

//same as signup getError logic
const getError = (errors, prop) => {
    try {
        return errors.mapped()[prop].msg;
    } catch(err) {
        return "";
    }
}

module.exports = ({ errors }) => {
    //return html as content to layout
    return layout({ content: `
    <div>
        <form method="POST">
            <input name="email" placeholder="email"/>
            ${getError(errors, "email")}
            <input name="password" placeholder="password"/>
            ${getError(errors, "password")}
            <button>Sign In</button>
        </form>
    </div>
    `
});
};