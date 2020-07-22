const fs = require("fs");
const crypto = require("crypto");
const util = require("util"); //nodeJS utilities, promisify

const scrypt = util.promisify(crypto.scrypt); //scrypt becomes version of the function we created and NOW RETURNS A PROMISE

class UsersRepository {
    //constructor executes whenever new UserRepository instance made
    constructor(filename) {
        if(!filename) {
            throw new Error("creating a repository requires a filename")
        }

        this.filename = filename;

        try {
            fs.accessSync(this.filename);
        } catch (err) {
            //err means file doesnt exist
            //create file
            fs.writeFileSync(this.filename, "[]"); //creates users.json and add []
        }
    }

    async getAll() {
        //  Open the file call this.filename
        //  Parse the contents
        //  Return the parsed data
        return JSON.parse(
            await fs.promises.readFile(this.filename, {      encoding: "utf8" 
            })
        );
    };

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


        const record = {
            ...attributes,
            password: `${buffer.toString("hex")}.${salt}`
        }

        //pass in all attrs, replace password with hashed+salt password
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

    //records that need to be saved
    async writeAll(records) {
        //  write the updated "records" array back to this.filename
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2)); //FORMATS users.json = null formatter, 2 level of indentation
    }

    //generate random Id for each record using node.js crypto module
    randomId() {
        return crypto.randomBytes(4).toString("hex");
    }

    //pass in id of record we want retrieved
    async getOne(id) {
        const records = await this.getAll(); //get all records
        return records.find(record => record.id = id); //find record with id passed in = record.id
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id); //return true if record.id !== id

        console.log(filteredRecords); //records with record specified deleted
        await this.writeAll(filteredRecords); //write records without deleted record
    }

    async update(id, attributes) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if(!record) {
            throw new Error(`record with id ${id} not found`);
        }
        //Update
        //takes key val pairs from attributes
        //copys pairs onto record obj
        //2.  record === {email: test@test.com} assign attrs to record
        //1.  attrs === {password: "password"}  take atrrs
        Object.assign(record, attributes);
        //3. record === {email: "test@test.com", password: "password"}

        await this.writeAll(records);
    }

    //  GetOneBy filters and finds results to one record
    async getOneBy(filters) {
        const records = await this.getAll();

        //for of iterating through Array of records
        for(let record of records) {
            let found = true;

            //iterate over filters obj
            //look at every key val pair
            //for every key compare the value to the value of the appropriate key in the record obj
            //if not the same then update found to false
            //if found still = true then we have found the record were looking for

            //for in iterate through obj for every key val pair in obj
            for(let key in filters) {
                if(record[key] !== filters[key]) {
                    found = false; //did not find record
                }
            }
            //if found still true
            if(found) {
                return record;
            }
        }
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