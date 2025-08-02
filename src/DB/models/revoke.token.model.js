import mongoose from "mongoose";
 const revokeTokenSchema=new mongoose.Schema({
  idToken:{type:String,required:true,unique:true},
     expiresAccessDate:{type:Number,required:true},
     expiresRefreshDate:{type:Number,required:true},
     
     
 },{
     timestamps:true,
     toObject:{
         virtuals:true
     },
     toJSON:{
         virtuals:true
     }
 })

 export const RevokeTokenModel=mongoose.models.RevokeToken||mongoose.model("RevokeToken",revokeTokenSchema)
 RevokeTokenModel.syncIndexes()