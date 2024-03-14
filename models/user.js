
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select:false
  },
  referalCode: {
    type: String
  },
  registerationReferalCode: String,
  uid: {
    type: String,
    required: true
  },
  balance:Number,
  token: String,
  tokenExpiration: Date,
},
  {
    timestamps: true
  })




  // 
userSchema.pre("save", async function (req, res, next) {
  if (this.password && this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(this.password, salt);
      this.password = password;
  }
});

// signed jwt and return 
userSchema.methods.getSignedJwtToken = function () {
   const token =  jwt.sign({
     _id: this._id,
     phone: this.phone,
     referalCode: this.referalCode,
     uid: this.uid
   }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY_DURATION });
  return "Bearer " + token
}

// match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// generate and hash password token
userSchema.methods.getResetPasswordToken = function () {

  // generate token.
  const token = crypto.randomBytes(6).toString("utf-8")
 
  // hash token and set to the resetPasswordToken field;
  this.token = crypto.createHash("sha256")
                              .update(token)
                              .digest("hex");

  // set expire duration to 10 mins.
  this.tokenExpiration = Date.now() + 10 * 60 * 1000;

  return resetToken
}

module.exports = mongoose.model("User", userSchema);