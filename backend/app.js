if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("static"));
app.use(cors());
/**
 * CORS requests
 */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const routes = require("./routes/meal"); //to import the routes/meal.js
const routes2 = require("./routes/fornitore"); //to import the routes/fornitore.js
const routes3 = require("./routes/utente");
const routes4 = require("./routes/feedback");
const routes5 = require("./routes/acquisto");
app.use(express.json());

app.use("/", routes);
app.use("/", routes2);
app.use("/", routes3);
app.use("/", routes4);
app.use("/", routes5);

app.use(express.static("frontend"));

app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;
