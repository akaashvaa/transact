import express from 'express'
import dotenv from 'dotenv'
import mongoose from "mongoose" 
import { rootRouter } from "./routes/rootRouter.js"
import cors from "cors"

dotenv.config()


const app = express()
const port = process.env.PORT || 8000

app.use(cors())
  
const MONGODB_URI = process.env.MONGODB_URI  
    
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use("/api/v1", rootRouter)

  mongoose.connect(MONGODB_URI).then((result) => {
    console.log('mongo db connected ')
    app.listen(port, function () {
      console.log('app is listening to port ', port)
    })
  })
  .catch((error) => console.log("can't start the app", error.message))
