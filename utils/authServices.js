const jwt = require('jsonwebtoken')
const AppError = require('./AppError')

const signToken = async(id) => {
    return await jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const verifyToken  = async (token) => {
    return new Promise((resolve, reject) => { 
      jwt.verify(token, process.env.JWT_SECRET,(err, decoded) => {
            if(err){
              reject(new AppError("yours token has expired" , 403))
            }
            else{
              resolve(decoded)
            }
      })
    })
}

module.exports = {
    signToken,
    verifyToken
}