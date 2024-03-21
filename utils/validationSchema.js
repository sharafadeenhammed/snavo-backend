const joi = require("joi")


 const registerationSchema = joi.object({
  phone: joi.string().required().trim(),
  password: joi.string().required().min(8),
  confirmPassword: joi.ref("password"),
  referalCode: joi.string(),
  fullname: joi.string().required().trim(),
  email: joi.string().email().required()
  // email: joi.string().email({ minDomainSegments: 2, tlds: { allow: [ 'com', 'net' ] } })
})
 const loginSchema = joi.object({
  phone: joi.string().required().trim(),
  password: joi.string().required().min(8),
})

module.exports = {
  registerationSchema,
  loginSchema
}