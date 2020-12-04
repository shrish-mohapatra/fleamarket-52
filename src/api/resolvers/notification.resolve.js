const Notification = require("../models/notification.model");

module.exports = {

    /*
        @desc    Create notification
        @param   args: {title, message, tag, userID}
        @return  mongoDB notification instance
    */
    createNotification: async(args) => {
        const {title, message, userID, tag} = args;
        let notification = new Notification({title, message, userID, tag});
        return notification.save();
    },

    /*
        @desc    Delete notification
        @param   args: {notificationID}
    */
    deleteNotification: async(args) => {
        const {notificationID} = args;
        await Notification.findByIdAndDelete(notificationID);
        return "Deleted notification.";
    },
}