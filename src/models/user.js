const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema( {
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Email is invalid");
        }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Password is weak" + value);
        }
    }
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
    min : 18 ,
    max : 100,
  },
  gender: {
    type: String,
    lowercase: true,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Gender data is invalid");
      }
    },
  },
  photoUrl: {
  type: String,
  default: "https://www.w3schools.com/howto/img_avatar.png",
  validate(value){
        if(!validator.isURL(value)){
            throw new Error("URL is invalid");
        }
    }
},
  bio:{
    type: String,
    default: "This is a bio",
    minlength: 2,
    maxlength: 50,
  },
  skills:{
    type: [String],
    default: [],
  }


},
{
    timestamps: true,
});


userSchema.methods.getJWT = async function (){
  const user = this;
  const token = await jwt.sign({_id: user._id}, "DEVTINDER@123", {expiresIn: "7d"});
  return token;
};

userSchema.method.passwordValidate = async function (passwordInputFromUser){
  const user = this ; 
  const passwordHash = user.password ; 
  const isPasswordValid = await bcrypt.compare(passwordInputFromUser, passwordHash);

  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
