const User = require('../model/user')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const { signToken } = require('../utils/authServices')
const Profile = require('../model/profile')
const crypto = require("crypto");
const bcrypt = require("bcrypt")
const {sendEmail} = require('../utils/sendEmail')
const Token = require('../model/Token')
const mongoose = require('mongoose')
const path = require("path")

const signUp = catchAsync(async(req, res, next) => {
    const {
        email,
        password,
        role
     } = req.body
 
     let user = await User.findOne({ email })
 
     if(user){
         return next(new AppError('user already exist, Please login', 400))
     }
 
     const newUser = await User.create({
        email,
        password,
        role,
     })
     
     const accessToken = await signToken(newUser._id)
     
     const findUser = await User.findOne(
        { email: {$eq: email }}
      )

    await Profile.create({
         userId : findUser._id
     })

     return res.status(201).json({
         status : 'success',
         accessToken,
         user : findUser
     })
})

const login = catchAsync( async ( req , res , next) => {
    const { email , password } = req.body;

    //1) Check if the email and password exists
    if (!email || !password) {
        next(new AppError('Please provide email and password', 400))
    }
    
    const user = await User.findOne(
        { email: {$eq: email }}
      ).select('+password')

    if (!user) {
        return next(new AppError("user doesn't exist", 401))
    }
    const correct = await user.correctPassword(password, user.password)

    if (!correct) {
        return next(new AppError('Incorrect password', 401))
    }
    //3) If everything is ok, send token to client
    const findUser = await User.findOne(
        { email: {$eq: email }}
      )

    const accessToken = await signToken(user._id)

    res.status(200).json({
        status: 'success',
        accessToken,
        user : findUser
    }) 
})

const requestResetPassword = catchAsync( async(req,res, next)=>{
    const { email } = req.body

    const findUser = await User.findOne({ email })

    if(!findUser){
       return next(new AppError("User doesn't exist",404))
    }
   
   let resetToken = crypto.randomBytes(32).toString("hex");
   const hash = await bcrypt.hash(resetToken,12);

   // create token schema

   const link = `http://localhost:3000/passwordlink/${resetToken}/${findUser._id}`
   // send 

   await Token.create({
       userId: mongoose.Types.ObjectId(findUser._id),
       token : hash,
       createdAt : Date.now()
   })
   
   await sendEmail(findUser?.email,"Password Reset Request",{Link: link,expirationTime: 1},"/template/passwordReset.ejs");

   return res.status(200).json({
       status : 'success',
       message : "please check your email"
   })
})

const resetPassword = catchAsync( async(req,res, next)=>{
    const { userId, token, password } =req.body
    const passwordResetToken = await Token.findOne({ userId : mongoose.Types.ObjectId(userId) });
    
    if (!passwordResetToken) {
       return next(new AppError("Invalid or expired password reset token", 401))
    }
    
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    
    if (!isValid) {
       return next(new AppError("Invalid or expired password reset token", 401))
    }

    const hash = await bcrypt.hash(password,12);

    await User.updateOne(
    { _id: mongoose.Types.ObjectId(userId) },
    { $set: { password: hash } },
    { new: true }
   );

   const user = await User.findById({ _id: mongoose.Types.ObjectId(userId) });

   await sendEmail(user?.email,"Password Sucessfully Changed",{},"/template/passwordChanged.ejs");

   await passwordResetToken.deleteOne();
   return res.status(200).json({
          status : 'success',
          message : "password has been changed"
   })
})

module.exports = {
    login , 
    signUp,
    requestResetPassword,
    resetPassword
}
