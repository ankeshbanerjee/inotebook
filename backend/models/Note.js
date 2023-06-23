const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId, //Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s).
    ref : 'user'
  },
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  tag : {
    type : String,
    default : "General"
  },
  date : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('note', noteSchema) // model creation by mongoose.model(modelName, schemaName)