const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./connection");

require("dotenv").config(); //This has to be above the process.env, if not PORT will be undefined
const { PORT } = process.env;

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); //Through this method I can access the files in public by typing "http://localhost:8000/ImageFileName"
app.use("/users", require("./controllers/users"));
app.use("/products", require("./controllers/products"));
app.use("/cart", require("./controllers/carts"));
app.use("/orders", require("./controllers/orders"));
app.listen(PORT, console.log(`App is running on PORT:${PORT}`));
