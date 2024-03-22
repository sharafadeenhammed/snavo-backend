const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const errorHandeler = require('./utils/errorHandeler');
const ErrorMessage = require('./utils/errorMessage');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();

const auth = require('./routes/auth')
const coinPayment = require('./routes/coinPayments')
const user = require('./routes/user')
const recharge = require("./routes/recharge")
const withdraw = require("./routes/withdraw")

const connectDb = require('./db/connect');

const app = express()
connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cookieParser());  
app.use(morgan("dev"))

app.use("/auth", auth);
app.use("/coin", coinPayment);
app.use("/user", user);
app.use("/recharge", recharge);
app.use("/withdraw", withdraw);

// handling 404 not found error;
app.use((req, res, next) => {
  return next(new ErrorMessage("not found", 404));
})

app.use(errorHandeler);





const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server started on port '+ PORT))