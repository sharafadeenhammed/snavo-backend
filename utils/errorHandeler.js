

async function errorHandeler(data, req, res, next) {
  // console.log(data);
  if (data.code === 11000) {
    data.statusCode = 400
    const fields = Object.keys(data.keyValue).join(" and ")
    data.message = `user with  ${fields} already exists`;
  }
  if (data.message.includes("buffering timed out")) {
    data.statusCode = 400
    data.message = "please try again after some time";
  }
  // handling invalid id error
  if (data.message.includes("Cast to ObjectId failed for value")) {
    data.statusCode = 404
    data.message = "resource not found";
  }
  if (data.message.includes("connect ETIMEDOUT") ||
    data.message.includes("Request failed with status code 400")
  ) {
    data.statusCode = 500
    data.message = "failed sending otp please try again after some time";
  }
  statusCode = data.statusCode || 500;
  message = data.message || "something went wrong try again after sometime";
  res.status(statusCode).json({message, success: false});
}

module.exports = errorHandeler;