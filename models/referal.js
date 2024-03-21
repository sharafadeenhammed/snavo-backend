const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");


const referalSchema = new Mongoose.Schema({
  referalCode: {
    type: String,
    required: true
  },
  referedById: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  referalUserId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

module.exports = Mongoose.model("Referal", referalSchema);


