
import {SECRET_TOKEN} from "../../config.js"
import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
   const {authorization} = req.headers
  if( !authorization || !authorization.startsWith("Bearer ") ){
    return res.status(403).json({
    type : "header authorization",
    message : "header doesn't exist"
    })
  } 
  const token = authorization.split(" ")[1];
  try {
   const decode = jwt.verify(token, SECRET_TOKEN)
    req.userId = decode.userId
    next()
  } catch (error) {
    return res.status(403).json({
      type: "header decode",
      message : "jwt verification failed"
    })
  } 
}

export {authMiddleware}
