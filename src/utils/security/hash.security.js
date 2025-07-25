import bcrypt from "bcrypt"
export const generateHash=({plaintext="",saltRounds=12}={})=>{
    return bcrypt.hashSync(plaintext,parseInt(saltRounds))
}
export const compareHash=({plaintext="",hash=""}={})=>{
    return bcrypt.compareSync(plaintext,hash)
}
