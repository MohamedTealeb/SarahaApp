import path from "node:path";
import multer from "multer";
import fs from "node:fs"
export const fileValidators={
    image:["image/jpeg","image/png","image/jpg","image/gif"],
    file:["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation"]
}
export function localFileUpload({customPath="genral",fileValidation=[]}={}){
   let basePath=`uploads/${customPath}`
    let fullPath=path.resolve("./src",basePath)
   
    const storage=multer.diskStorage({
        destination:function(req,file,callback){
            if(req.user?.id){
                basePath+=`/${req.user.id.toString()}`
                fullPath=path.resolve("./src",basePath)
            }
            if(!fs.existsSync(fullPath)){
                fs.mkdirSync(fullPath,{recursive:true})  
            }
          callback(null,fullPath)
        },
        filename:function(req,file,callback){
            const uniqueFileName=(Date.now()+"_"+Math.random()+file.originalname)
            file.finalpath=basePath+"/"+uniqueFileName
            callback(null,uniqueFileName)
        }
    })
    const fileFilter=(req,file,callback)=>{
       
        console.log(file)
        if(!fileValidation.includes(file.mimetype)){
          return callback("Invalid file type",false)
        }else{
         callback(null,true)
        }
    }

    return multer({dest:"temp",fileFilter,storage})
} 