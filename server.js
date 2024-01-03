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

//***********************************************
// Create our Express Application Object
//*********************************************** 
const app = express()

//*********************************
// Middleware
//********************************* 
app.use(morgan("dev")) //logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically

//*********************************
// Routes
//********************************* 
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.")
})

app.get("/fruits/seed", async (req, res) => {

    try{
        // array of starter fruits
        const startFruits = [
          { name: "Orange", color: "orange", readyToEat: false },
          { name: "Grape", color: "purple", readyToEat: false },
          { name: "Banana", color: "orange", readyToEat: false },
          { name: "Strawberry", color: "red", readyToEat: false },
          { name: "Coconut", color: "brown", readyToEat: false },
          ]
  
       // Delete all fruits
       await Fruit.deleteMany({})
    
       // Seed Starter Fruits
       const fruits = await Fruit.create(startFruits)
    
       // send created fruits as response to confirm creation
       res.json(fruits);
    } catch(error) {
      console.log(error.message)
      res.status(400).send(error.message)
    }
  });

  // Index Route Get -> /fruits
app.get("/fruits", async (req, res) => {
    try {
      const fruits = await Fruit.find({});
      // render a template
      // fruits /index.ejs = views/fruits/index.ejs
      res.render("fruits/index.ejs", { fruits });
    } catch (error) {
        console.log("---------", error.message, "----------")
      res.status(400).send(error.message);
    }
  });
  
  

//********************************** 
// Server Listener
//********************************** 
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))