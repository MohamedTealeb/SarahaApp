import { v2 as cloudinary } from "cloudinary";

export const cloud=()=>{
    cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET,
        secure:true
    })
    return cloudinary
}
export const uploadFile = async ({ file = {}, path = "general" }) => {
    const cloudInstance = cloud(); 
    return cloudInstance.uploader.upload(file.path, {
      folder: `${process.env.APPLICATION_NAME}/${path}`,
    });
  };


  export const destroyFile = async ({ public_id = "" }) => {
    
    return await cloud().uploader.destroy(public_id)

}