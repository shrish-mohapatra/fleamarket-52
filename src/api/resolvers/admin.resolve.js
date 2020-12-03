const Admin = require("../models/admin.model");

module.exports = {

    /*
        @desc    Create portfolio account with zero balance
        @return  admin MongoDB instance
    */
    createAdmin: async() => {
        // Only 1 admin instance can exist at a time
        await Admin.deleteMany({});

        let admin = new Admin();
        return admin.save();
    },

    /*
        @desc    Get day offset
        @return  # of days ahead of current time
                    ex. Today          -> Dec 2
                        getDayOffset() -> 4
                        Server Time    -> Dec 6
    */
    getDayOffset: async() => {
        let result = await Admin.find();
        return result[0].dayOffset;
    },

    /*
        @desc    Create portfolio account with zero balance
        @params  args: { days }
    */
    editDayOffset: async(args) => {
        const { days } = args;

        let admin = await Admin.findOne();
        admin.dayOffset += days;
        admin.save();
    }

}