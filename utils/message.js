const axios = require("axios").default
const apisauce = require("apisauce");

const api = apisauce.create({
  baseURL:process.env.TERMI_BASE_URL
})

async function message(message, to, type) {
  // api.defaults.baseURL = process.env.TERMI_BASE_URL;
  api.setBaseURL(process.env.TERMI_BASE_URL);
  // send otp as message
  if (type === "phone") {
    const response = await api.post("/api/sms/send", {
      api_key: process.env.TERMI_API_KEY,
      to: to,
      sms: message,
      type: "plain",
      from: process.env.TERMI_SENDER_ID,
      channel: "generic"
    })
    console.log(response.data);
    if (response.ok) return { success: true , message: "message sent successfully" };
    return { success: false , message: "message sending failed please try again " };
    
  } else {
    const response = await api.post("/api/email/otp/send", {
      api_key: process.env.TERMI_API_KEY,
      email_address: to,
      code: message,
    })
    if (response.ok) return {success: true, message: "email sent successfully" };
    return { success: false, message: "email sending failed please try again " };
  }
 
}
module.exports = message;