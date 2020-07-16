const fs = require("fs");
const crypto = require("crypto");
const { create } = require("domain");

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
        //set id
        attributes.id = this.randomId();

        // attributes passed in = {email: "asfsdf.com", password: "sjadkfjls"}
        const records = await this.getAll(); //get current list of users
        records.push(attributes); //push new user

        await this.writeAll(records);
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
}

//helper to test
const test = async () => {
    //instance 
    //  Get access to repo
    const repo = new UsersRepository("users.json"); //user.json = filename passed in

    await repo.update("694f64e4", {password: "mypassword"});
};

test(); 



//to run in terminal in repositories directory
//node users.js