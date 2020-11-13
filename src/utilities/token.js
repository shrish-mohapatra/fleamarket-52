const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");

// Toggle whether requests from server require token
const BYPASS_ORIGIN_AUTH = true
const BYPASS_ROUTES = ['login', 'signup', 'stock']

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

/*
    @desc    Validate user authorization
    @param   (req, res, next)
*/
const validate = (req, res, next) => {
    try {        
        if(!requires_auth(req)) return next();
    
        // Check for token
        const token = req.headers.token;
        if(!token) return res.status(400).json({
            message: "Missing token."
        })

        // Refresh token
        const decoded = jwt.verify(token, keys.key);
        const newToken = createToken(decoded.userID);

        res.append('token', newToken);
        next();        
    } catch(error) {
        return res.status(400).json({message: error.message})
    }
}

/*
    @desc    Check if request requires authorization
    @param   (req)
    @return  boolean: true (requires auth), false (no auth required)
*/
const requires_auth = (req) => {
    if(BYPASS_ORIGIN_AUTH && req.get('origin') !== "http://localhost:3000") return false;

    // GraphQL query check
    if(req.body.query) {
        return !check_query(req.body.query);
    }

    // REST API route check
    return !check_query(req.url.toString());
}

/*
    @desc    Check if query contains bypass routes
    @param   (query): ex. 'login'
    @return  boolean: true (contains bypass), false (doesnt contain bypass)
*/
const check_query = (query) => {
    for(route in BYPASS_ROUTES) {
        if(query.includes(BYPASS_ROUTES[route])) return true;
    }
    return false;
}

module.exports = {
    createToken,
    validate
}