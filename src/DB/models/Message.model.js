import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    attachments:[{secure_url:String,public_id:String}],
    content:{
        type:String,
        required:function(){
            return this.attachments?.length<1?true:false
        },
        minlength:3,maxlength:[20000,"content annot 20000 char while you have entered "]},
   
  
   
   
  receivedBy:{
    type:mongoose.Schema.Types.ObjectId,ref:'User',require:true
  }
 
   
    
    
},{
    timestamps:true,
   
})

export const MessageModel=mongoose.models.Message||mongoose.model("Message",messageSchema)
MessageModel.syncIndexes()