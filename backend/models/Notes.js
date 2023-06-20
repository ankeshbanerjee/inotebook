import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema({
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  tags : {
    type : String,
    default : "General"
  },
  date : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema) // model creation by mongoose.model(modelName, schemaName)