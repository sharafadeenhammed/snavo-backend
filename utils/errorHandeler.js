

async function errorHandeler(data, req, res, next) {
  if (data.code === 11000) {
    data.statusCode = 400
    const fields = Object.keys(data.keyValue).join(" and ")
    data.message = `user with  ${fields} already exists`;
  }
  statusCode = data.statusCode || 500;
  message = data.message || "something went wrong";
  res.status(statusCode).json({message, success: false});
}

module.exports = errorHandeler;