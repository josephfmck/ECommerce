const { check } = require("express-validator");

const usersRepo = require("../../repositories/users");


//check("propToValidate") auto knows to check str as prop
//sanitization: to trim/normalizeEmail() or do something to prop before check/validating it isEmail()

module.exports = {
    requireTitle: check("title")
        .trim()
        .isLength({ min: 5, max: 40})
        .withMessage("Must be between 5 and 40 characters"),
    requirePrice: check("price")
        .trim()
        .toFloat()
        .isFloat({ min: 1})
        .withMessage("Must be a number greater than 1"),
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
            } else {
                return true;
            }
    }),
    requireEmailExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must provide valid email")
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({email: email});
        if(!user) {
            throw new Error("Email not found");
        }
    }),
    requireValidPasswordForUser: check("password")
    .trim()
    .custom(async (password, { req })=> {
        //get user checking for
        const user = await usersRepo.getOneBy({ email: req.body.email });

        //if user undefined
        if(!user) {
            throw new Error("Invalid password");
        }

        //T/F of comparision passwords
        const validPassword = await usersRepo.comparePasswords(
            user.password,
            password
        );
        //if users pass !== password provided
        if(!validPassword) {
            throw new Error("invalid Password");
        }
    })
};