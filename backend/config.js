const SECRET_TOKEN ="COHORT2"

const responseHandler = (res, statusCode = 400, response = {}) => {
   return res.status(statusCode).json(response)
}

export {SECRET_TOKEN, responseHandler}
