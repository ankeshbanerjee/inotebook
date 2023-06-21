const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  date : {
    type : Date,
    default : Date.now
  }
});

const User = mongoose.model('User', userSchema) // model creation by mongoose.model(modelName, schemaName)
// User.createIndexes() //Creates indexes on collections
module.exports = User