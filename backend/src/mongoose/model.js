import { Schema, model } from 'mongoose'
  
const userSchema = new Schema({
  userName : {
    type : String,
    required :true,
    unique : true,
    trim : true,
    maxLength : 30,
    minLength  : 3
  },
  password : {
    type : String,
    required :true,
    minLength : 3
  }, 
  firstName : {
    type : String,
    required : true,
    trim : true,
    maxLength : 50
  },
  lastName : {
    type : String,
    required : true,
    trim : true,
    maxLength : 50
  }
})
const accountSchema = new Schema({
  userId : {
  type : Schema.Types.ObjectId,
  ref : 'User',
  required : true
  },
  balance : {
   type : Number,
   required : true
}
})

 const User = model("User", userSchema)
 const Account = model("Account", accountSchema)

export {User, Account}
