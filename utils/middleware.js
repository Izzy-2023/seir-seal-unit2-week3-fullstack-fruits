// ****************************
// DEPENDENCIES
// ****************************
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const FruitRouter = require("../controllers/fruit");
const UserRouter = require("../controllers/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const HomeRouter = require("../controllers/home")

//*********************************
// Middleware
//********************************* 
const middleware = (app) => {
    app.use(morgan("tiny")); //logging
    app.use(methodOverride("_method")); // override for put and delete requests from forms
    app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
    app.use(express.static("public")); // serve files from public statically
    app.use(
      session({
        secret: process.env.SECRET,
        store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
        saveUninitialized: true,
        resave: false,
      })
    );
    app.use("/fruits", FruitRouter);
    app.use("/user", UserRouter);
    app.use("/", HomeRouter)
  };

  ///////////////////////////////////////////
// Export Middleware Function
//////////////////////////////////////////
module.exports = middleware