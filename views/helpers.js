module.exports = {
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
    getError(errors, prop) {
        try {
            return errors.mapped()[prop].msg;
        } catch (err) {
            return "";
        }
    }
};