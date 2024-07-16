//import User from "../mongoose/model.js"
import {Router} from "express"
import {z} from "zod"
import {User, Account} from "../../mongoose/model.js"
import {responseHandler} from "../../../config.js"
import { SECRET_TOKEN } from "../../../config.js"
import jwt from "jsonwebtoken"
import {authMiddleware} from "../../middlewares/middleware.js" 
const userRouter = Router()

const zUserSchema = z.object({
  userName : z.string().trim().min(3, { message: "userName must be 5 or more characters long" }).max(30, { message: "Must be 30 or fewer characters long" }),
  password : z.string().min(3, { message: "password must be 3 or more characters long" }),
  firstName : z.string().trim().max(50, { message: "firstName must be 50 or fewer characters long" }),
  lastName : z.string().trim().max(50, { message: "lastName must be 50 or fewer characters long" })
})

userRouter.post("/signup", async (req,res) => {
   
   
  const result = zUserSchema.safeParse(req.body)
  // find user using userName is it is not exist then create new one
  let response = {}
  try { 

    // zod validation 
   if(!result.success){
    console.log("zod validation failed")

     response = {
        type : "zod validation",
        message : result.error
        }
      return responseHandler(res,411, response)
    }     

    const isUserExist = await User.findOne({userName : req.body.userName})
    // if user exist
    if(isUserExist){
       response = {
      type : "user signup",
	    message: "username already taken"
    }
      return responseHandler(res,411,response) 
    }
    // if not then create one 
    const newUser = new User(req.body)
    await newUser.save()
    await Account.create({
      userId : newUser._id ,
        balance : (1 + Math.random()*1000).toFixed(2)
    })
   const jwtToken = jwt.sign({ userId : newUser._id },SECRET_TOKEN)
   response = {
      type : "user login",
	message: "User created successfully",
	token: jwtToken
}
    return responseHandler(res, 201, response)

  } catch (error) {
    
   return responseHandler(res ) 
  }
})
 

// sign in logic
const zSignIn = z.object({
  userName: z.string().trim(),
  password : z.string().trim()
})
userRouter.post("/signin", async (req, res) => {
  const result =  zSignIn.safeParse(req.body)
  let response = {}
  if(!result.success){
    console.log("login input validation failed", result.error)
   response = {
      type :"zod validation",
	message: "Error while logging in"
}
    return responseHandler(res,411, response)
  }
  try {
    const user = await User.findOne({userName : req.body.userName})
    // if user doesn't exist 
    if(!user){
      response  = {
        type : "user login",
        message : "userName doesn't exist"
      } 
      return responseHandler(res,411, response)
    }

    // if password is wrong
    if(user.password !== req.body.password){
       response  = {
        type : "usesr login",
        message : "password is incorrect"
      }
      return responseHandler(res,411, response)
    }
    const jwtToken = jwt.sign({userId : user._id} , SECRET_TOKEN)
    response = {
      type : "user logged in successfully",
	    token: jwtToken
}
    return responseHandler(res, 200, response)
  } catch (error) {
   return responseHandler(res) 
  }
})

const updateBody = z.object({
  password  : z.string().min(5).optional(),
  firstName : z.string().optional(),
  lastName : z.string().optional()
})

userRouter.put("/", authMiddleware, async (req, res) => {
  let response = {}
  const result = updateBody.safeParse(req.body)
  if(!result.success) {
    response = {
    type : "update details",
    message : "invalid zod validation"
    } 
    return responseHandler(res,411,response)
  }

  try {

  await User.findOneByIdAndUpdate(req.userId, req.body)
    response = {
    type : "update details",
    message :  "updated successfully"
    }
    return responseHandler(res,200,response)
  } catch(error) {
     return responseHandler(res)
  }
})

// filtered user => search query
 userRouter.get("/bulk", async (req, res) => {
   const filter  = req.query.filter || ""

 try {
   const user = await User.find({
   $or : [{
   firstName : { "$regex" : filter   },
   lastName : { "$regex" : filter }
        }]
   }).select("-password")
   const response = {
     type : 'filtered user',
     user
   }
   return responseHandler(res,200,response)
 } catch {
    return responseHandler(res)
 }
})
export { userRouter}
