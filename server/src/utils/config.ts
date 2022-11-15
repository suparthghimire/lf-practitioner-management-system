import { ConvertTimeToSec } from "./helpers";

const CONFIG = {
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  PORT: parseInt(process.env.PORT as string) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
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
};

export default CONFIG;
