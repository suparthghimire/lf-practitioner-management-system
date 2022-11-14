export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export const ACCESS_TOKEN_EXPIRY = ConvertTimeToSec(
  Number(process.env.ACCESS_TOKEN_EXPIRY) || 10,
  "m"
);
export const REFRESH_TOKEN_EXPIRY = ConvertTimeToSec(
  Number(process.env.ACCESS_TOKEN_EXPIRY) || 7,
  "d"
);

export const REFRESH_TOKEN_COOKIE_NAME =
  process.env.REFRESH_TOKEN_COOKIE_NAME ||
  "X-REFRESH-TOKEN-PRACTITIONER-MGMT-LF";

function ConvertTimeToSec(time: number, unit: "s" | "m" | "h" | "d") {
  switch (unit) {
    case "s":
      return time;
    case "m":
      return time * 60;
    case "h":
      return time * 60 * 60;
    case "d":
      return time * 60 * 60 * 24;
  }
}
