const Mongoose = require("mongoose");


const rechargeSchema = new Mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: [true, "please enter the address you wish to withdraw to"]
  },
  status: {
    type: String,
    required: [true, "please enter status"],
    enum: ["Pending", "Failed", "Success"]
  },
  userId: {
    type: Mongoose.Types.ObjectId,
    required: [true, "please provide user id"],
  },
  coin: {
    type: String,
    default:"USDT"
  },
  description: {
    type: String,
    default:""
  }
}, {
  timestamps: true
});


module.exports = Mongoose.model("Withdraw", rechargeSchema);