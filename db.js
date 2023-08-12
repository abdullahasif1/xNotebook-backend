const mongoose = require('mongoose');


const mongoURI = "mongodb+srv://abdullah:abdullahasif@cluster0.vao4c1n.mongodb.net/xNotebook?retryWrites=true&w=majority"





"mongodb://localhost:27017/xnotebook"




const connectToMongo = () =>{
    mongoose.connect(mongoURI, (err)=>{
        if(err) console.log(err) 
        else console.log("Connected to Mongo Successfully");
    })
    
}

module.exports = connectToMongo;