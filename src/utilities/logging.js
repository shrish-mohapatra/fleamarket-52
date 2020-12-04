module.exports = {
    logURL: (req, res, next) => {
        if(!req.url.includes("graph")) console.log(`---> (${req.method}) ${req.url}`);
        next();
    }
}