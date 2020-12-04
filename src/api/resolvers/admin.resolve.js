const Admin = require("../models/admin.model");

module.exports = {

    /*
        @desc    Create portfolio account with zero balance
        @params  startDate: <string> server start date
        @return  admin MongoDB instance
    */
    createAdmin: async(startDate) => {
        // Only 1 admin instance can exist at a time
        await Admin.deleteMany({});

        let admin = new Admin({startDate});
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
        @desc    Get server start date
        @return  moment object formatted as string
    */
    getStartDate: async() => {
        let result = await Admin.find();
        return result[0].startDate;
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