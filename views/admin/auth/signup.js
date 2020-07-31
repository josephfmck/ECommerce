const layout = require("../layout");


const getError = (errors, prop) => {
    //  prop === "email" || "password" || "passwordConfirmation"
    //errors = arr of objs
    //mapped convert arr as obj with keys email, password, passwordConfirmation
    //keys of obj = [prop] = email, password, pwConfirm
    // .msg get str

    //errors.mapped() === {
    //     email: {
    //         msg: "Invalid Email"
    //     },
    //     password: {
    //         msg: "password too short"
    //     },
    //     passwordConfirmation: {
    //         msg: "passwords must match"
    //     }
    // }
    try {
        return errors.mapped()[prop].msg;
    } catch (err) {
        //means looked up error msg that doesnt exist
        return "";
    }
};

//assume pass in obj with a req prop for template
module.exports = ({ req, errors }) => {
    return layout({ content: `
    <div>
        Your id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email"/>
            ${getError(errors, "email")}
            <input name="password" placeholder="password"/>
            ${getError(errors, "password")}
            <input name="passwordConfirmation" placeholder="password confirmation"/>
            ${getError(errors, "passwordConfirmation")}
            <button>Sign Up</button>
        </form>
    </div>
    `
}); 
};