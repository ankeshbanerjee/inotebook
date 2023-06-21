const mongoose = require('mongoose')

// If you are using latest nodejs (v17.x) , then try updating mongodb url from localhost to 127.0.0.1, otherwise server keeps crashing
const mongoURI = "mongodb://127.0.0.1:27017/inotebook"  // 'uri/mydb' to create and store data in new db called 'mydb'

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
}

module.exports = connectToMongo

