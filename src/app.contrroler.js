import path from 'node:path'
import * as dotenv from 'dotenv'
dotenv.config({path:path.join('./src/config/.env.dev')})
import express from 'express'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import connectDB from './DB/connection.db.js'
import { globalErrorHandling } from './utils/response.js'
import cors from 'cors'
export const  bootstrap=async()=>{
    const app=express()
    const port=process.env.PORT
    //middleware
    app.use(cors())
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