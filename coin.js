const coinpayments = require("coinpayments").default


const client = new coinpayments({
  key: "f69f081c10a197cea8ac425ff01cc3258b25f3eaec55ee84afc7800a9051ce30",
  secret: "ABaCa40FAfeDac39e54a461719C0a7e36caA37cb120442265162745Abfe4615D"
})


async function get_callaback(data = {}){
  try {
    const res = await client.getCallbackAddress({ currency: 'USDT' });
    const data = {
      success: true,
      ...res,
    };
    console.log(data);
    return data;
  } catch (error) {
    console.log("error res: ", error);
    const data =  {
      success: false,
      message: error.extra.data.error || "something went wrong try again after sometime",
    }
    console.log("error res: ");
  }
}


get_callaback()