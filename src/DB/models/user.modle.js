import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    firstName:{type:String,required:true,minlength:3,maxlength:[20,"Too long name"]},
    lastName:{type:String,required:true,minlength:3,maxlength:[20,"Too long name"]},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:function(){
        return this.provider==="local"?true:false
    }},
    gender:{type:String,enum:["male","female"],default:"male"},
    phone:{type:String,required:function(){
        return this.provider==="local"?true:false
    }},
    confirmEmail:{Date},
    role:{type:String,enum:["user","admin"],default:"user"},
    picture:{secure_url:String,public_id:String},
    provider:{type:String,enum:["google","local"],default:"local"},
    confirmEmailOtp:{type:String},
    forgotCode:{type:String},
    freezeAt:{type:Date},
    freezeBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    restoredBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    changeLoginCredentials:{type:Date,default:Date.now},
    cover:{type:[String]},
  
    
    
},{
    timestamps:true,
    toObject:{
        virtuals:true
    },
    toJSON:{
        virtuals:true
    }
})
userSchema.virtual("fullName").set(function(value){
 const [firstName,lastName]=value.split(" ")||[]
 this.set({firstName,lastName})
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})
userSchema.virtual("messages",{
    
    localField:"_id",
    foreignField:"receivedBy",
    ref:"Message"
}


)
 
export const UserModel=mongoose.models.User||mongoose.model("User",userSchema)
UserModel.syncIndexes()