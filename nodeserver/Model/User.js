const mongoose=require('mongoose');

const User=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    }
});


module.exports=mongoose.model('User',User);
