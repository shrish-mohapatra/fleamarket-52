const bcrypt = require("bcrypt");
const keys = require("../../../config/keys");
const token = require("../../utilities/token");

const User = require("../models/user.model");
const { createAccount } = require("./account.resolve");

module.exports = {

    /*
        @desc    Check if user exists in db and return auth token
        @param   args: {email, password}
        @return  token: JWT with userID serialized
    */
    login: async(args) => {
        let {email, password} = args;
        let user = await User.findOne({email});

        if(!user) {
            throw Error("User with that email does not exist.");
        }

        // Compare encrypted passwords (w/ api key)
        const validated = await bcrypt.compare(
            password + keys.key,
            user.password
        );

        if(!validated) {
            throw Error("Incorrect password entered.");
        }

        return {
            token: token.createToken(user.id),
            userID: user.id,
            message: `Succesfully logged in as ${user.email}.`
        }
    },


    /*
        @desc    Create new user, save to DB, and return auth token
        @param   args: {email, password}
        @return  token: JWT with userID serialized
    */
    signup: async(args) => {
        let {email, password} = args;
        let user = await User.findOne({email});

        if(user) {
            throw Error("User with that email already exists.");
        }

        // Create MongoDB instance and save to database
        password = await bcrypt.hash(password + keys.key, 10);
        user = await new User({email, password});
        user.save();

        createAccount({
            userID: user.id,
            type: "Non-Registered",
            balance: 1000,
        });

        return {
            token: token.createToken(user.id),
            userID: user.id,
            message: `Succesfully registered as ${user.email}.`
        }
    },

}