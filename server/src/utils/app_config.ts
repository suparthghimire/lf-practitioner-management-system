import { ConvertTimeToSec } from "./helpers";

// Config variables for the app
const CONFIG = {
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  PORT: parseInt(process.env.PORT as string) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  CLIENT_DEV_ENDPOINT:
    process.env.CLIENT_DEV_ENDPOINT || "http://localhost:4173",
  CLIENT_PRD_ENDPOINT:
    process.env.CLIENT_PRD_ENDPOINT || "http://localhost:5173",
  ACCESS_TOKEN_EXPIRY: ConvertTimeToSec(
    Number(process.env.ACCESS_TOKEN_EXPIRY) || 10,
    "m"
  ),
  REFRESH_TOKEN_EXPIRY: ConvertTimeToSec(
    Number(process.env.ACCESS_TOKEN_EXPIRY) || 7,
    "d"
  ),
  REFRESH_TOKEN_COOKIE_NAME:
    process.env.REFRESH_TOKEN_COOKIE_NAME ||
    "X-REFRESH-TOKEN-PRACTITIONER-MGMT-LF",
  MAX_IMG_SIZE: 1024 * 1024 * 5, //5mb
};

export default CONFIG;
