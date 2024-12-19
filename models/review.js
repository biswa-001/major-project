const mongoose=require("mongoose");
const { Schema } = mongoose;
const reviewschema=new Schema({
comment:String,
rating:{
    type:Number,
    min:0,
    max:5
},

createAt:{
    type:Date,
    default:Date.now()
},

author:{
    type:Schema.Types.ObjectId,
    ref:"User",
},

});

module.exports=mongoose.model("Review",reviewschema);