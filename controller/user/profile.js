const Profile = require('../../model/profile')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/AppError')
const mongoose = require('mongoose')

const createProfile = catchAsync( async(req, res , next)=>{
   const { _id } = req.user
   const dataToUpdate = {...req.body}

   const findProfile = await Profile.findOne( { userId : mongoose.Types.ObjectId(_id) })

   if(!findProfile)
    {
        return new AppError("user not found", 404)
    }

   const updateProfile = await Profile.findOneAndUpdate({ userId : mongoose.Types.ObjectId(_id) } , dataToUpdate , { runValidation : true , new: true })

   return res.status(200).json({
        data : updateProfile,
        message : 'profile is updated'
   })
})

module.exports = {
    createProfile
}