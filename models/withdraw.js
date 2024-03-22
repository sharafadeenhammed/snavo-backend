const Mongoose = require("mongoose");


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
    type: Mongoose.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});
