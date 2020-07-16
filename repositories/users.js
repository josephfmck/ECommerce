const fs = require("fs");
const crypto = require("crypto");

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
}

//helper to test
const test = async () => {
    //instance 
    //  Get access to repo
    const repo = new UsersRepository("users.json"); //user.json = filename passed in

    const user = await repo.getOne("71d09f01");

    console.log(user);
};

test(); 



//to run in terminal in repositories directory
//node users.js