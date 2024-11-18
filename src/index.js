const express = require("express");
const routes = require("./routes");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on http://localhost:" + (process.env.PORT));
});
