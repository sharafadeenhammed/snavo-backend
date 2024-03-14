const axios = require("axios")


async function message(message, type) {
  const api = axios.create(process.env.TERMII_URL);
  api.post("/")
}