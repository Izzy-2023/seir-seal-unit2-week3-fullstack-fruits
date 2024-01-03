// ****************************
// DEPENDENCIES
// ****************************
require("dotenv").config() // load .env variables
const express = require("express") // our web framework
const morgan = require("morgan") // our logger
const methodOverride = require("method-override") // override forms
const mongoose = require("mongoose") // connect to our mongodb

// *****************************
// DATABASE CONNECTION
// *****************************
// our database connection string
const DATABASE_URL = process.env.DATABASE_URL

// *****************************
// Establish our connection
// *****************************
mongoose.connect(DATABASE_URL)

// *****************************
// Events for when connection opens/disconnects/errors
// *****************************
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

//********************************************** 
// Our Models
//********************************************** 
// pull schema and model from mongoose
const {Schema, model} = mongoose

// make fruits schema
const fruitsSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

// make fruit model
const Fruit = model("Fruit", fruitsSchema)

