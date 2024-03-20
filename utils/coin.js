const coinpayments = require("coinpayments").default

const client = new coinpayments({
  key: process.env.COINPAYMENT_KEY,
  secret: process.env.COINPAYMENT_SECRET
})


async function get_callaback(currency = "USDT", user) {
  try {
    const response = await client.getCallbackAddress({ label: user._id, currency: currency, ipn_url: `${process.env.APP_DOMAIN}/coin/confirm` });
    const data = {
      success: true,
      coin:currency,
      ...response,
    };
    return data;
  } catch (error) {
    return {
      success: false,
      message: "something went wrong try again after sometime",
    }
  }
}


module.exports = {
  get_callaback
}