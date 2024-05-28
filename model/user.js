/**
 * user.js
 * @description :: model of a database collection user
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const schema = new Schema(
{
    email: { 
      type: String, 
      required : true , 
      unique : true, 
      validate: {
        validator: function(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email address'
    }
    },
    password : { type : String , select : false, required : true},
    role : { type : String , enum : ["admin" , "user"], required : true},
    isActive : { type : Boolean , default : true },
    createdAt : { type : Date },
    updatedAt: {  type : Date}
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

schema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const schemaModel = mongoose.model("user", schema);
module.exports = schemaModel;
