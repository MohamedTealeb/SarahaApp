import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    firstName:{type:String,required:true,minlength:3,maxlength:[20,"Too long name"]},
    lastName:{type:String,required:true,minlength:3,maxlength:[20,"Too long name"]},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    gender:{type:String,enum:["male","female"],required:true,default:"male"},
    phone:{type:String,required:true},
    confirmEmail:{Date},
    role:{type:String,enum:["user","admin"],default:"user"},
    
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
export const UserModel=mongoose.models.User||mongoose.model("User",userSchema)
UserModel.syncIndexes()