// Modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

// Custom
const database = require("./config/database");
const logging = require("./src/utilities/logging");
const graphql_schema = require("./src/api/graphql/schema");

// REST Routes
const authRouter = require("./src/api/routes/auth.routes");
const stockRouter = require("./src/api/routes/stock.routes");
const orderRouter = require("./src/api/routes/order.routes");

const app = express();
const port = 8000;

// Configure Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logging.logURL);

// Configure GraphQL
app.use('/api/graph', graphqlHTTP((req, res) => ({
    schema: graphql_schema,
    graphiql: true,
})))

app.use('/api/rest/auth', authRouter);
app.use('/api/rest/stock', stockRouter);
app.use('/api/rest/order', orderRouter);

database.connectAtlas();

app.listen(port, () => {
    console.log("\nServer is running on port " + port);
})