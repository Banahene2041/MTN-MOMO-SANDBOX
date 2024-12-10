import dotenv from "dotenv"
dotenv.config()
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { StatusCodes } from "http-status-codes"
const { BASE_URL, DISBURSEMENT_PRIMARY_KEY } = process.env
import { BadRequestError } from "../errors/customErrors.js"

//Create Disbursement User
export const createDisbursementUser = async (req, res) => {
  const providerCallbackHost = req.body.providerCallbackHost
  if (!providerCallbackHost) {
    throw new BadRequestError("provideCallbackHost")
  }

  const referenceId = uuidv4()
  const response = await axios.post(
    `${BASE_URL}/v1_0/apiuser`,
    { providerCallbackHost },
    {
      headers: {
        "X-Reference-Id": referenceId,
        "Ocp-Apim-Subscription-Key": DISBURSEMENT_PRIMARY_KEY,
        "Content-Type": "application/json",
      },
    }
  )

  res.status(StatusCodes.CREATED).json({
    msg: "API User created successfully",
    referenceId,
  })
}

// Get Disbursement User
export const getDisbursementUser = async (req, res, next) => {
  try {
    const { referenceId } = req.params
    const response = await axios.get(
      `${BASE_URL}/v1_0/apiuser/${referenceId}`,
      {
        headers: {
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": DISBURSEMENT_PRIMARY_KEY,
        },
      }
    )
    res.status(StatusCodes.OK).json({ msg: response.data })
  } catch (error) {
    next(
      error.response
        ? new UnauthorizedError(error.response.data.message)
        : error
    )
  }
}

// Generate Disbursement API KEY
export const generateDisbursementApiKey = async (req, res, next) => {
  try {
    const { referenceId } = req.params
    const response = await axios.post(
      `${BASE_URL}/v1_0/apiuser/${referenceId}/apikey`,
      {},
      {
        headers: {
          "Ocp-Apim-Subscription-Key": DISBURSEMENT_PRIMARY_KEY,
          "Content-Type": "application/json",
        },
      }
    )
    res.status(StatusCodes.OK).json({ msg: response.data })
  } catch (error) {
    next(
      error.response
        ? new UnauthorizedError(error.response.data.message)
        : error
    )
  }
}
