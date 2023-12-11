import { JWT } from "google-auth-library";
import { TCredentials } from "../../types/TCredentials";

const getJWT = (credentials:TCredentials):JWT => {
  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  })
}

export default getJWT;
