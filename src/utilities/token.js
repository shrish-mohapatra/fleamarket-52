const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");


/*
    @desc    Create JWT with userID serialized
    @param   userID
    @return  token: JWT w/ expiry of 1h
*/
const createToken = (userID) => (
    jwt.sign(
        { userID, date: Date.now()},
        keys.key,
        {expiresIn: "1h"}
    )
)

module.exports = {
    createToken,
}