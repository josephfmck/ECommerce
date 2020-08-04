const fs = require("fs");
const crypto = require("crypto");
const util = require("util"); //nodeJS utilities, promisify

const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt); //scrypt becomes version of the function we created and NOW RETURNS A PROMISE


//extends: take everything inside class Repository and copy it to this UsersRepository
class UsersRepository extends Repository {
     //create and add new user
     async create(attributes) {
        //ASSUME: attrs === { email: "", password: ""}

        //set id
        attributes.id = this.randomId();


        //https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback
        //8 = # of bytes
        const salt = crypto.randomBytes(8).toString("hex"); //random #'s and letter's
        
        //scrypt hashes
        const buffer = await scrypt(attributes.password, salt, 64); //scrypt promisify'd to replace callback with a promise


        // attributes passed in = {email: "asfsdf.com", password: "sjadkfjls"}
        const records = await this.getAll(); //get current list of users


        //replace password with hashed+salt password
        const record = {
            ...attributes,
            password: `${buffer.toString("hex")}.${salt}`
        }

        //pass in all attrs
        records.push(record); //push new user

        await this.writeAll(records);

        return record; //   Get back record obj with ID, and hashed password for Authentication
    }

    
    //saved DB passWd, supplied passWd user inputed 
    async comparePasswords(saved, supplied) {
        //  Saved -> password saved in our database. "hashed.salt"
        //  Supplied -> password given to us by a user trying sign in

        // const result = saved.split("."); //split the hash and salt, turns into arr
        // const hashed = result[0]; 
        // const salt = result[1];
        //^^^^^^^^^^^^^^^^SAME
        const [hashed, salt] = saved.split("."); //Same logic

        //hash the supplied passWd
        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64); //pass in pw, salt

        //compare returns T/F
        return hashed === hashedSuppliedBuffer.toString("hex");
    }
}


//Export an INSTANCE of the class
module.exports = new UsersRepository("users.json");

//this RIGHT way
//ANOTHER FILE... easier way
//const repo = require("./users");
//repo.getAll();
//repo.getOne();

//YET ANOTHER FILE...
//const repo = require("./users");
//repo.getAll();
//LETS US HAVE JUST ONE COPY OF UsersRepo





//NOT GOOD WAY
//module.exports = UsersRepository;

//ANOTHER FILE.... have to do
//const UsersRepository = require("./users");
//const repo = new UsersRepository("users.json");

//WHY?
//YET ANOTHER FILE... ends up creating more than one json if you misspell users.json
//const UsersRepository = require("./users");
//const repo = new UsersRepository("uses.json");