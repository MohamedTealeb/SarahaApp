import jwt from "jsonwebtoken"

export  const generateToken=({payload,signature="secret key 123",options={expiresIn:"1h"}})=>{
    return jwt.sign(payload,signature,options)
}
export  const verifyToken=({token,signature="secret key 123"})=>{
    return jwt.verify(token,signature)
}   