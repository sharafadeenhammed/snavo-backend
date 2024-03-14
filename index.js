const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const errorHandeler = require('./utils/errorHandeler');
const cors = require('cors');
const dotenv = require("dotenv");

const auth = require('./routes/auth')
const connectDb = require('./db/connect');

const app = express()
dotenv.config()
connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cookieParser());  
app.use(morgan("dev"))

app.use("/auth", auth)


app.use(errorHandeler);





const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server started on port '+ PORT))