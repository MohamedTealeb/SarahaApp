import express from 'express'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import connectDB from './DB/connection.db.js'
import { globalErrorHandling } from './utils/response.js'
export const  bootstrap=async()=>{
    const app=express()
    const port=3000;
    //DB
    await connectDB()
    app.use(express.json())
    app.get('/',(req,res)=>{
        res.json("Our API")
    })
    app.use('/auth',authController)
    app.use('/user',userController)
app.all('{/*dummy}',(req,res)=>{
    res.status(404).json({message:"Page not found"})
})
app.use(globalErrorHandling)

    app.listen(port,()=>{
        console.log(`Example app listening on port ${port}`)
    })
}