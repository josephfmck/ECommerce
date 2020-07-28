const layout = require("../layout");


//assume pass in obj with a req prop for template
module.exports = ({ req }) => {
    return layout({ content: `
    <div>
        Your id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="password confirmation"/>
            <button>Sign Up</button>
        </form>
    </div>
    `
}); 
};