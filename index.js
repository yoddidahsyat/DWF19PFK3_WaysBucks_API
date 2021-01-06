//instatiate express module
const express = require("express");

//instatiate cors module
var cors = require("cors");

//use express in app variable
const app = express();

// use .env
require("dotenv").config();

//import route module
const router = require("./src/routes");

//define the server port
const port = 5000;

//use bodyparser
app.use(express.json());

//use cors
app.use(cors());

//akses upload directory
app.use("/api/v1/uploads", express.static("uploads"));

app.use("/api/v1", router);

app.listen(port, () => console.log(`Connected to port ${port}`));
