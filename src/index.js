const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
