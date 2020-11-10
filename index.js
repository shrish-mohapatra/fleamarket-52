// Modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

// Custom
const database = require("./config/database");
const graphql_schema = require("./src/api/graphql/schema");
const logging = require("./src/utilities/logging");
const simulate = require("./src/utilities/simulate");
const { validate } = require("./src/utilities/token");

// REST Routes
const authRouter = require("./src/api/routes/auth.routes");
const stockRouter = require("./src/api/routes/stock.routes");
const orderRouter = require("./src/api/routes/order.routes");

const app = express();
const port = 8000;

// Configure Middleware
app.use(cors())
app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logging.logURL);
app.use(validate)

// Serve react app
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static("public"));

// Configure GraphQL
app.use('/api/graph', graphqlHTTP((req, res) => ({
    schema: graphql_schema,
    graphiql: true,
})))

app.use('/api/rest/auth', authRouter);
app.use('/api/rest/stock', stockRouter);
app.use('/api/rest/order', orderRouter);

database.connectAtlas();
simulate();

app.listen(port, () => {
    console.log("\nServer is running on port " + port);
})