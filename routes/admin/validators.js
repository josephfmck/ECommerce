const { check } = require("express-validator");

const usersRepo = require("../../repositories/users");


//check("propToValidate") auto knows to check str as prop
//sanitization: to trim/normalizeEmail() or do something to prop before check/validating it isEmail()

module.exports = {
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must be valid email")
        .custom( async (emailValue) => {
            //SIGN UP VALIDATION
            //if someone has signed up with given email 
            const existingUser = await usersRepo.getOneBy({ email: emailValue}); //where email: checked email provided
            if(existingUser) {
                throw new Error("Email already in use");
            }
        }),
    requirePassword: check("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Must be between 4 and 20 characters"),
    requirePasswordConfirmation: check("passwordConfirmation")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Must be between 4 and 20 characters")
        .custom((pwConfirmationValue, { req }) => {
            //Password Signup Validation 
            if(pwConfirmationValue !== req.body.password) {
            throw new Error("Passwords must match");
            }
    })
};