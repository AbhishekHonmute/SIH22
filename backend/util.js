const axios = require("axios");
const config = require("config");
var crypto = require("crypto");

async function compareHashedPassword(password, dbpassword) {
  try {
    const hashedPassword = crypto
      .pbkdf2Sync(password, "", 1000, 64, `sha512`)
      .toString(`hex`);
    return hashedPassword === dbpassword;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function returnHashedPassowrd(password) {
  try {
    const hashedPassword = crypto
      .pbkdf2Sync(password, "", 1000, 64, `sha512`)
      .toString(`hex`);
    return hashedPassword;
  } catch (error) {
    console.log(error.message);
    return password;
  }
}

module.exports = {
  compareHashedPassword,
  returnHashedPassowrd,
};
