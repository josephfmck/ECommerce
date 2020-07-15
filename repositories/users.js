const fs = require("fs");

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
        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: "utf8" }));
    };
}

//helper to test
const test = async () => {
    //instance 
    const repo = new UsersRepository("users.json"); //creates user.json

    const users = await repo.getAll();

    console.log(users);
};

test(); 



//to run in terminal in repositories directory
//node users.js