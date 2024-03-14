const mongoose = require('mongoose')

async function connectDb() {
  try {
    const { MONGODB_REMOTE_URI, MONGODB_LOCAL_URI } = process.env
    const connect =await mongoose.connect(MONGODB_REMOTE_URI)
    console.log(`connected to mongodb and using ${connect.connection.name} database on port ${connect.connection.port}`)
  } catch (error) {
    console.log("error: ",error)
  }
}

module.exports = connectDb