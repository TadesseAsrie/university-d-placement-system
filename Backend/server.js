const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/db");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3800;
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);






//connection function
async function start() {
  try {
    const result = await dbConnection.execute("select 'verify'");
    await app.listen(PORT);
    console.log("database connection established");
    console.log(`server running port ${PORT}`);
  } catch (err) {
    console.log(err.message);
  }
}
start();
