import {Router} from "express"
import  {userRouter} from "./user/user.routes.js"

import  {accountRouter} from "./user/user.account.js"
const rootRouter = Router()

/* 
 * 1. user/signin
 * 2. user/signup
 * 3. user/bulk => return all user
*/

rootRouter.use("/user", userRouter)

/*
 * 1.account/balance
 * 2. account/transfer
 * */

rootRouter.use("/account", accountRouter)
export { rootRouter }
