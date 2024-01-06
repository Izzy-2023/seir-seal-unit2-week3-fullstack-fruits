//////////////////////////////////
// Import dependencies
/////////////////////////////////
const mongoose = require("./connection");
const Fruit = require("./fruit");

//////////////////////////////////
// Seed Code
//////////////////////////////////
mongoose.connection.on("open", async () => {
  // seed code goes in this function

  try {
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
    const data = await Fruit.create(startFruits);

    // log the create fruits to confirm
    console.log("--------FRUITS CREATED----------");
    console.log(data);
    console.log("--------FRUITS CREATED----------");

    // close the DB connection
    mongoose.connection.close();
  } catch (error) {
    console.log("-------", error.message, "-----------");
  }
});