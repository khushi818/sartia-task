const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const schema = new Schema(
{
    userId : { 
       type : Schema.Types.ObjectId,
       ref : 'user',
       unique : true 
    },
    name : { type : String },
    age : { type : String  },
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

const schemaModel = mongoose.model("profile", schema);
module.exports = schemaModel;