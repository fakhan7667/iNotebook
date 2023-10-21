const mongoose = require('mongoose');


const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
// const mongoURI = "mongodb://localhost:27017/inootbook?appName=MongoDB%2520Compass&directConnection=true&tls=false&readPreference=primary";


const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connected to mongo succesfully");
    })
}


module.exports = connectToMongo;