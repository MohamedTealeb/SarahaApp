import jwt from "jsonwebtoken"
export const signatureLevelEnum={
    Bearer:"Bearer",
    System:"System"
}
export  const generateToken=({payload,signature=process.env.ACCESS_USER_TOKEN_SIGNATURE,options={expiresIn:Number(process.env.ACCESS_TOKEN_EXPIRES_IN)}})=>{
    return jwt.sign(payload,signature,options)
}
export  const verifyToken=({ token = "", signature = process.env.ACCESS_USER_TOKEN_SIGNATURE }) => {
    if (!token || typeof token !== "string" || token.split(".").length !== 3) {
      throw new Error("JWT malformed: invalid format or empty token");
    }
  
    return jwt.verify(token, signature);
  };
 
  export const getSignatures=async({signatureLevel=signatureLevelEnum.Bearer}={})=>{
    let signatures = {
        accessSignature: undefined,
        refreshSignature: undefined
      };
    
      switch (signatureLevel) {
        case signatureLevelEnum.System:
          signatures.accessSignature = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE;
          signatures.refreshSignature = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE;
          break;
        default:
          signatures.accessSignature = process.env.ACCESS_USER_TOKEN_SIGNATURE;
          signatures.refreshSignature = process.env.REFRESH_USER_TOKEN_SIGNATURE;
      }
      return signatures
  }