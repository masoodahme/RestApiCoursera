const mongoose=require("mongoose");
const { use } = require("../routes");
const Schema=mongoose.Schema;
const userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
});
const user=mongoose.model('user',userSchema);
module.exports=user;