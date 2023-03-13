const express = require("express");
const { signup, login, logout } = require("./controller/user.controller");
const { connection } = require("./config/db");
const bcrypt = require("bcrypt");
const { authenticator } = require("./middlewares/authenticator");
const { refresh } = require("./controller/refresh.controller");
const { checkRoles } = require("./middlewares/authorization");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.post("/signup", signup);

app.post("/login", login);

app.post("/logout", logout);

app.post("/refresh/token", refresh);

app.get("/products", authenticator,checkRoles("customer","seller"), (req, res) => {
  res.send("Products....");
});

app.post("/addProducts", authenticator, checkRoles("seller"), (req, res) => {
  res.send({ msg: "product has been added" });
});

app.delete("/deleteProducts", authenticator, checkRoles("seller"), (req,res)=>{
    res.send({msg:"product has been deleted"})
});

app.listen(process.env.PORT, async () => {
  try {
    console.log("Server is running");
    await connection;
    console.log("DB is connected");
  } catch (error) {
    console.log("Db is not connected");
    console.log(error);
  }
});
