const BYPASS_URL = ['graph', 'static', 'favicon']

module.exports = {
    logURL: (req, res, next) => {
        for(let i=0; i<BYPASS_URL.length; i++) {
            if(req.url.includes(BYPASS_URL[i])) return next();
        }
        console.log(`---> (${req.method}) ${req.url}`);
        next();
    }
}