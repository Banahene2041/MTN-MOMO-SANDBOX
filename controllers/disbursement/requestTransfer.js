import dotenv from "dotenv"
dotenv.config()
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
const {
  BASE_URL,
  DISBURSEMENT_PRIMARY_KEY,
  DISBURSE_USER_ID,
  DISBURSE_API_KEY,
} = process.env
import { StatusCodes } from "http-status-codes"
import { UnauthorizedError } from "../../errors/customErrors.js"


export const generateDisburseAccessToken = async(req,res,next) => {
    const authHeader = `Basic ${Buffer.from(`${DISBURSE_USER_ID}:${DISBURSE_API_KEY}`).toString(
      "base64"
    )}`
    try {
      const response = await axios.post(
        `https://sandbox.momodeveloper.mtn.com/disbursement/token/`,
        {},
        {
          headers: {
            Authorization: authHeader,
            "Ocp-Apim-Subscription-Key": DISBURSEMENT_PRIMARY_KEY,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      )
      res.status(StatusCodes.OK).json({
        msg: "Access token created successfully",
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in,
      })
    } catch (error) {
      throw new UnauthorizedError(
        error?.response?.data?.message || error.message
      )
    }
}