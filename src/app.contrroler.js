import path from 'node:path'
import * as dotenv from 'dotenv'
dotenv.config({path:path.join('./src/config/.env.dev')})
import express from 'express'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import connectDB from './DB/connection.db.js'
import { globalErrorHandling } from './utils/response.js'
import cors from 'cors'
import messageController from'./modules/message/message.controller.js'
import { scheduleCleanupJobs } from './utils/cron/cleanup.cron.js'
export const  bootstrap=async()=>{
    const app=express()
    const port=process.env.PORT
    //middleware
    app.use(cors())
    //DB
    await connectDB()
    // Schedule recurring maintenance tasks (e.g., delete stale unverified users)
    scheduleCleanupJobs()
    app.use(express.json())
    app.use("/uploads",express.static(path.resolve("./src/uploads")))
    app.get('/',(req,res)=>{
        res.json("Our API")
    })
    app.use('/auth',authController)
    app.use('/user',userController)
    app.use('/message',messageController)
app.all('{/*dummy}',(req,res)=>{
    res.status(404).json({message:"Page not found"})
})
app.use(globalErrorHandling)


// await sendEmail({from:process.env.APP_EMAIL,to:"mohamedtealeb088@gmail.com ,	mohammedtealeb0155@gmail.com",subject:"Hello ✔",text:"Hello world moooooooo?",html:"<b>Hello world moooooooo?</b>",attachments:[{filename:"test.txt",content:"Hello world moooooooo?"}]})


    app.listen(port,()=>{
        console.log(`Example app listening on port ${port}`)
    })
}