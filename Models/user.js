const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    createdOn:{
        type:Date,
        default:Date.now(),
    }
});


// User Model
//        user collection will be plural and second pass the schema
mongoose.model('users',userSchema)

// module Exprorts 
//  yeah jab ham nay aik say zeyada martaba use karna ho model ko 
module.exports=mongoose.model('users');