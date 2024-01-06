////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Fruit = require("../models/fruit");

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

////////////////////////////////////////
// Router Middleware
////////////////////////////////////////
// Authorization Middleware
router.use((req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/user/login");
  }
});

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

router.get("/seed", async (req, res) => {
  try {
    // array of starter fruits
    const startFruits = [
      { name: "Orange", color: "orange", readyToEat: false },
      { name: "Grape", color: "purple", readyToEat: false },
      { name: "Banana", color: "orange", readyToEat: false },
      { name: "Strawberry", color: "red", readyToEat: false },
      { name: "Coconut", color: "brown", readyToEat: false },
    ];

    // Delete all fruits
    await Fruit.deleteMany({});

    // Seed Starter Fruits
    const fruits = await Fruit.create(startFruits);

    // send created fruits as response to confirm creation
    res.json(fruits);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

// Index Route Get -> /fruits
router.get("/", async (req, res) => {
  try {
    // get username from req.session
    const username = req.session.username
    // get all fruits
    const fruits = await Fruit.find({username});
    // render a template
    // fruits/index.ejs = ./views/fruits/index.ejs
    res.render("index.ejs", { fruits });
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});

// new route
router.get("/new", (req, res) => {
  res.render("new.ejs");
});

// Create Route (Post to /fruits)
router.post("/", async (req, res) => {
  try {
    // check if readyToEat should be true
    // expression ? true : false (ternary operator)
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // add username to req.body from req.session
    req.body.username = req.session.username
    // create the fruit in the database
    await Fruit.create(req.body);
    // redirect back to main page
    res.redirect("/");
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});

// edit route
router.get("/:id/edit", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // get the fruit from the database
    const fruit = await Fruit.findById(id);
    // render template and send it fruit
    res.render("edit.ejs", { fruit });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//update route
router.put("/:id", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // update the fruit
    await Fruit.findByIdAndUpdate(id, req.body, { new: true });
    // redirect user back to main page when fruit
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // delete the fruit
    await Fruit.findByIdAndRemove(id);
    // redirect user back to index page
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// show route
router.get("/:id", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;

    // find the particular fruit from the database
    const fruit = await Fruit.findById(id);

    // render the template with the data from the database
    res.render("show.ejs", { fruit });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router;

