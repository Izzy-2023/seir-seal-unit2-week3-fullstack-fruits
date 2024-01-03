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

  // new route
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs")
})

// create route
app.post("/fruits", async (req, res) => {
  try {
    // check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // create the new fruit
    await Fruit.create(req.body);
    // redirect the user back to the main fruits page after fruit created
    res.redirect("/fruits");
  } catch (error) {
    console.log("-----", error.message, "------")
    res.status(400).send(error.message);
  }
});

// Edit Route (Get to /fruits/:id/edit)
app.get("/fruits/:id/edit", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // get the fruit from the db
    const fruit = await Fruit.findById(id);
    //render the template
    res.render("fruits/edit.ejs", { fruit });
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});

//update route
app.put("/fruits/:id", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // update the fruit
    await Fruit.findByIdAndUpdate(id, req.body, { new: true });
    // redirect user back to main page when fruit
    res.redirect(`/fruits/${id}`);
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send(error.message);
  }
});

// The Delete Route (delete to /fruits/:id)
app.delete("/fruits/:id", async (req, res) => {
  // get the id
  const id = req.params.id
  // delete the fruit
  await Fruit.findByIdAndDelete(id)
  // redirect to main page
  res.redirect("/fruits")
})


// The Show Route (Get to /fruits/:id)
app.get("/fruits/:id", async (req, res) => {
  try{
      // get the id from params
      const id = req.params.id

      // find the particular fruit from the database
      const fruit = await Fruit.findById(id)

      // render the template with the fruit
      res.render("fruits/show.ejs", {fruit})
  }catch(error){
      console.log("-----", error.message, "------")
      res.status(400).send("error, read logs for details")
  }
})

  
  

//********************************** 
// Server Listener
//********************************** 
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))