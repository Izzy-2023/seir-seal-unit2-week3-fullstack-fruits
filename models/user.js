////////////////////////////////
// Import Dependencies
///////////////////////////////

const mongoose = require("./connection")

///////////////////////////////
// Define Model
///////////////////////////////
const {Schema, model} = mongoose

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

// make user model
const User = model("User", userSchema)

//////////////////////////////////////////
// Export Model
//////////////////////////////////////////

module.exports = User