const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/db");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3800;
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const blockRoutes = require("./routes/blockRoutes");
const dormRoutes = require("./routes/dormRoutes"); 
const placementRoutes = require("./routes/placementRoutes");
const academicYearRoutes = require("./routes/academicYearRoutes");
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/dorms", dormRoutes); 
app.use("/api/placements", placementRoutes);
 app.use("/api/academic-years", academicYearRoutes);
app.use("/api/reports", reportRoutes);





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
