import CryptoJS from "crypto-js"
export const generateEncryption=({plaintext="",key="secret key 123"}={})=>{
    return CryptoJS.AES.encrypt(plaintext,key).toString()
}
export const decryptEncryption=({ciphertext="",key="secret key 123"}={})=>{
    return CryptoJS.AES.decrypt(ciphertext,key).toString(CryptoJS.enc.Utf8)
}
