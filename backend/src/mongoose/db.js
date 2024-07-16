import {User} from "./model.js"
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI  

export const connectToDB = () => {
 return mongoose.connect(MONGODB_URI)
}


