const Mongoose = require("mongoose");


const invertmentSchema = new Mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  packageName: {
    type: String,
    required:[true, "please enter package name"]
  },
  investmentType: {
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
})