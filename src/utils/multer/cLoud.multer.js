import multer from "multer";



export const cloudFileUpload=({validation=[]}={})=>{
   
  const storage=multer.diskStorage({})
   
  
      function fileFilter(req, file, callback) {
      // If no validation mimetypes provided, accept all files
      if (!validation || validation.length === 0) {
        return callback(null, true);
      }
      if (validation.includes(file.mimetype)) {
        return callback(null, true);
      }
      return callback(new Error("invalid file type"), false);
    };
  
    return multer({
      storage,
      fileFilter,
    });
  }
  