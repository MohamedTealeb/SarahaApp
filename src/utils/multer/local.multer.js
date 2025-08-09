import path from "node:path";
import multer from "multer";
import fs from "node:fs";


export function localFileUpload({
    customPath = "genral",
    fileValidation = [],
    maxFileSizeMB = 2
  } = {}) {
    let basePath = `uploads/${customPath}`;
    let fullPath = path.resolve("./src", basePath);
  
    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        if (req.user?.id) {
          basePath += `/${req.user.id.toString()}`;
          fullPath = path.resolve("./src", basePath);
        }
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
        callback(null, fullPath);
      },
      filename: function (req, file, callback) {
        const uniqueFileName = Date.now() + "_" + Math.random() + file.originalname;
        file.finalpath = basePath + "/" + uniqueFileName;
        callback(null, uniqueFileName);
      }
    });
  
    const fileFilter = (req, file, callback) => {
      if (!fileValidation.includes(file.mimetype)) {
        return callback("Invalid file type", false);
      }
      callback(null, true);
    };
  
    return multer({
      storage,
      fileFilter,
      limits: { fileSize: maxFileSizeMB * 1024 * 1024 }
    });
  }
  