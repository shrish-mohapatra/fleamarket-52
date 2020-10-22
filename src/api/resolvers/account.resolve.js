const Account = require("../models/account.model");

module.exports = {

    /*
        @desc    Create portfolio account with zero balance
        @param   args: {userID, type}
        @return  account MongoDB instance
    */
    createAccount: async(args) => {
        let {userID, type} = args;

        let account = await new Account({
            type,
            userID,
            balance: 0
        });

        return account.save();
    },

}