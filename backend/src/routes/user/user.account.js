import {Router} from "express"
import {authMiddleware} from "../../middlewares/middleware.js"
import {responseHandler} from "../../../config.js"
import mongoose from "mongoose"
import {Account} from "../../mongoose/model.js"

const accountRouter = Router()
accountRouter.get("/balance", authMiddleware,  async (req, res) => {
    try {
        const account = await Account.findOne({ userId : req.userId})
        console.log("user iD", req.userId, account)
        const response = {
        type : "account balance",
        message : { balance : account.balance }
      }
    return responseHandler(res,200, response)
    } catch (error) {
      return responseHandler(res,400, {message : "cant find id"})
    }

})

accountRouter.post("/transfer" , authMiddleware, async (req, res) => {
  const {to, amount} = req.body
  let response = {}
  const session = await mongoose.startSession()
  session.startTransaction()
  try {

    // if other reciever party does not exist 
    const toUser = await Account.findOne({ userId : to }).session(session)
    if(!toUser){
      await session.abortTransaction()
      response = {
        type : "Transaction",
        message : "Invalid Reciever Account"
      }
      return responseHandler(res,400, response)
    }
    
    const fromUser = await Account.findOne({ userId : req.userId }).session(session)
    // if balance is not enough
    if(!fromUser || fromUser.balance <= 0 || fromUser.balance < amount  ) {
      await session.abortTransaction()
      response = {
        type : "Transaction",
        message : "Insufficient Balance or Invalid Sender Account"
      }
      return responseHandler(res, 400,  response)
    }

    fromUser.balance -= (+amount)
    toUser.balance += (+amount)

    await fromUser.save({ session })
    await toUser.save({ session })
    await session.commitTransaction()
    console.log(fromUser.balance , toUser.balance)
    response = {
      type : "Transaction",
	message: "Transfer successful"
}
    //await Account.findByIdAndUpdate(to , { $inc : { balance : amount } }) 
      return responseHandler(res, 200, response)
  } catch (error) {
    await session.abortTransaction()
    response = {
      type : "Transaction",
      message : error 
    }
    return responseHandler(res, 400, response)
   } finally {
    await session.endSession()
  }
})

export {accountRouter}
