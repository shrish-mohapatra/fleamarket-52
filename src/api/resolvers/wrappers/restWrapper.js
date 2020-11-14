/*
    @desc    A wrapper to provide resolvers with data from REST API endpoints
    @param   {req, res}: express request and response params
    @return  token: JWT with userID serialized
*/
const restWrapper = async (req, res, resolve) => {
    let args = req.body;

    // User query parameters as arguments if they exist
    if(Object.keys(req.query).length != 0) {
        args = Object.assign(args, req.query);
    }

    // ID params as arguments if they exist
    if(Object.keys(req.params).length != 0) {
        args = Object.assign(args, req.params);
    }

    resolve(args)
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(error => {
            return res.status(400).json({
                message: error.message
            })
        })
}

module.exports = restWrapper