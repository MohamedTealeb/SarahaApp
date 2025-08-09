import multer from "multer";



export const cloudFileUpload=({validation=[]}={})=>{
   
  const storage=multer.diskStorage({})
   
  
      function fileFilter(req, file, callback) {
      if (validation.includes(file.mimetype)) {
        return callback(null, true);
      }
     return callback("invalid file type", false);
    };
  
    return multer({
      storage,
      fileFilter,
    });
  }
  