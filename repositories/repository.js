const fs = require("fs");
const crypto = require('crypto');



//methods moved from users.js
//Reusable repository class

module.exports = class Repository {
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

    //overwrites users.js create method
    async create(attributes) {
        attributes.id = this.randomId();

        const records = await this.getAll(); //get current list of users/products

        //add in new record
        records.push(attributes);

        //save records
        await this.writeAll(records);

        return attributes; //attrs updated with id
    }

    async getAll() {
        //  Open the file call this.filename
        //  Parse the contents
        //  Return the parsed data
        return JSON.parse(
            await fs.promises.readFile(this.filename, { encoding: "utf8" 
            })
        );
    };


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
        const filteredRecords = records.filter(record => record.id !== id); //for every record, return true if record.id !== id, returns all records that arent the deleted one

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