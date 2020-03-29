const express = require("express");
const connectDB = require("./config/db");
var cors = require('cors')


const app = express();

app.use(cors())
// connect database mongo
connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("API running");
});

//Define Routes
app.use("/api/product", require("./router/product"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server start on PORT ${PORT}`);
});
