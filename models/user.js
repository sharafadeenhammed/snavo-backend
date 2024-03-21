
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
  accountBarred: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  email: {
    type: String,
    unique: true,
    default: null,
    required:[true, "please enter your email"]
  },
  fullname: {
    type: String,
    required: [true, "please enter your full name"]
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select:false
  },
  referalCode: {
    type: String
  },
  registerationReferalId: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  refererCount: {
    type: Number,
    default: 0
  },
  validReferCount: {
    type: Number,
    default: 0
  },
  uid: {
    type: String,
    required: true
  },
  rank:{
    type: Number,
    default:0
  },
  transactionPin: {
    type: String,
    default: null
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
  const token = crypto.randomBytes(3).toString("hex").toLocaleUpperCase();
 
  // hash token and set to the resetPasswordToken field;
  this.token = crypto.createHash("sha256")
                              .update(token)
                              .digest("hex");

  // set expire duration to 10 mins.
  this.tokenExpiration = Date.now() + 60 * 60 * 1000;

  return token
}

module.exports = mongoose.model("User", userSchema);