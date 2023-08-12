const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: String,
        default: Date.now
    },
    // title:  String, // String is shorthand for {type: String}
    // author: String,
    // body:   String,
    // comments: [{ body: String, date: Date }],
    // date: { type: Date, default: Date.now },
    // hidden: Boolean,
    // meta: {
    //   votes: Number,
    //   favs:  Number
    // }

  });

  const User = mongoose.model('user',UserSchema);
  //User.createIndexes(); //if you want to check for no duplicate email cause email must he unique
  module.exports = User;