const joi = require("joi")


 const registerationSchema = joi.object({
  phone: joi.string().required().trim(),
  password: joi.string().required().min(8),
  confirmPassword: joi.ref("password"),
  referalCode: joi.string()
})
 const loginSchema = joi.object({
  phone: joi.string().required().trim(),
  password: joi.string().required().min(8),
})

module.exports = {
  registerationSchema,
  loginSchema
}