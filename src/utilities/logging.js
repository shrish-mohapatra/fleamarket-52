module.exports = {
    logURL: (req, res, next) => {
        console.log(`---> (${req.method}) ${req.url}`);
        next();
    }
}