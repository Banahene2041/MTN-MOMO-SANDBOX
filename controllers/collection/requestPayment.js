import dotenv from "dotenv"
dotenv.config()
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
const { BASE_URL, PRIMARY_KEY, USER_ID, API_KEY } = process.env
import { StatusCodes } from "http-status-codes"
import { UnauthorizedError } from "../../errors/customErrors.js"

export const generateAccessToken = async (req, res) => {
  const authHeader = `Basic ${Buffer.from(`${USER_ID}:${API_KEY}`).toString(
    "base64"
  )}`

  try {
    const response = await axios.post(
      `https://sandbox.momodeveloper.mtn.com/collection/token/`,
      {},
      {
        headers: {
          Authorization: authHeader,
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
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
    throw new UnauthorizedError(error?.response?.data?.message || error.message)
  }
}

export const requestPayment = async (req, res) => {
  const access_token = req.headers.paymentauthorization.split(" ")[1]
  const referenceId = uuidv4()
  const response = await axios.post(
    `${BASE_URL}/collection/v1_0/requesttopay`,
    req.body,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "X-Reference-Id": referenceId,
        "X-Target-Environment": "sandbox",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
      },
    }
  )
  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: "Payment request successful", data: response.data, referenceId })
}

export const getRequestToPayTransactionStatus = async (req, res, next) => {
  try {
    const { referenceId } = req.params
    const access_token = req.headers.paymentauthorization.split(" ")[1]
    if (!access_token) {
      throw new UnauthorizedError("Payment authorization header is missing")
    }
    const response = await axios.get(
      `${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
          Authorization: `Bearer ${access_token}`,
          "X-Target-Environment": "sandbox",
          "Cache-Control": "no-cache",
        },
      }
    )
    res
      .status(StatusCodes.OK)
      .json({ msg: "Status retrieved successfully", data: response.data })
  } catch (error) {
    next(
      error.response
        ? new UnauthorizedError(error.response.data.message)
        : error
    )
  }
}

export const getAccountBalance = async (req, res, next) => {
  try {
    const access_token = req.headers.paymentauthorization?.split(" ")[1]
    if (!access_token) {
      throw new UnauthorizedError("Payment authorization header is missing")
    }

    const response = await axios.get(
      `${BASE_URL}/collection/v1_0/account/balance`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "X-Target-Environment": "sandbox",
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
        },
      }
    )

    res.status(StatusCodes.OK).json({
      msg: "Account balance retrieved successfully",
      data: response.data,
    })
  } catch (error) {
    next(
      error.response
        ? new UnauthorizedError(
            error.response.data.message
          )
        : error
    )
  }
}

export const getPaymentStatus = async (req,res,next) => {
  try {
    const { referenceId } = req.params
    const access_token = req.headers.paymentauthorization.split(" ")[1]
    if (!access_token) {
      throw new UnauthorizedError("Payment authorization header is missing")
    }
    const response = await axios.get(
      `${BASE_URL}/collection/v2_0/payment/${referenceId}`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
          Authorization: `Bearer ${access_token}`,
          "X-Target-Environment": "sandbox",
          "Cache-Control": "no-cache",
        },
      }
    )
    res
      .status(StatusCodes.OK)
      .json({ msg: "Status retrieved successfully", data: response.data })
  } catch (error) {
    next(
      error.response
        ? new UnauthorizedError(error.response.data.message)
        : error
    )
  }
}
