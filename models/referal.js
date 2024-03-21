const Mongoose = require("mongoose");


const referalSchema = new Mongoose.Schema({
  referalCode: {
    type: String,
    required: true
  },
  referedById: {
    type: Mongoose.Types.ObjectId,
    required: true
  },
  userId: {
    type: Mongoose.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

module.exports = Mongoose.model("Referal", referalSchema);


