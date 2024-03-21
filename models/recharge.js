const mongoose = require("mongoose");


const rechargeSchema = new Mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  rechargeType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Failed", "Success"]
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
})