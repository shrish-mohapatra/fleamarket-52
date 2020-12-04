const Subscription = require("../models/subscription.model");

module.exports = {

    /*
        @desc    Create subscription
        @param   args: {rule, userID, stockID}
        @return  mongoDB subscription instance
    */
    createSubscription: async(args) => {
        const {rule, userID, stockID} = args;
        let subscription = new Subscription({
            rule,
            userID,
            stockID,
            active: true,
        });
        return subscription.save();
    },

    /*
        @desc    Update subscription activie state or rule
        @param   args: {subscriptionID, active*, role*}
        @return  mongoDB subscription instance
    */
    updateSubscription: async(args) => {
        const {subscriptionID, active, rule} = args;
        let subscription = await Subscription.findById(subscriptionID);
        
        if(active != null) subscription.active = active;
        if(rule != null) subscription.rule = rule;

        return subscription.save()
    },

    /*
        @desc    Delete subscription
        @param   args: {subscriptionID}
    */
    deleteSubscription: async(args) => {
        const {subscriptionID} = args;
        await Subscription.findByIdAndDelete(subscriptionID);
        return "Deleted subscription.";
    },
}