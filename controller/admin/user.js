const User = require('../../model/user')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/AppError')
const mongoose = require('mongoose')

const deActivateOrActivateUser = catchAsync(async(req,res, next) => {
     const { id} = req.body
     const { isActive} = req.query

     const user = await User.findOne({ _id : mongoose.Types.ObjectId(id)})

     const updateUser = await User.findOneAndUpdate({ _id : mongoose.Types.ObjectId(id) } ,{ isActive }, { runValidators : true , new : true})

     return res.status(200).json({
        message : "user data updated"
     })
})

module.exports = {
    deActivateOrActivateUser
}