import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { StatusCodes } from "http-status-codes"
const { BASE_URL, PRIMARY_KEY } = process.env
import {BadRequestError} from '../errors/customErrors.js'
// create user
export const createUser = async (req, res) => {
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
        "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
        "Content-Type": "application/json",
      },
    }
  )

  res.status(StatusCodes.CREATED).json({
    msg: "API User created successfully",
    referenceId,
  })
}

export const getUser = async(req,res)=> {
  const { referenceId } = req.params
  const response = await axios.get(`${BASE_URL}/v1_0/apiuser/${referenceId}`, {
    headers: {
      "Cache-Control": "no-cache",
      "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
    },
  })
  res.status(StatusCodes.OK).json({msg: response.data})
}

export const generateAPIKey = async(req,res) => {
  const { referenceId } = req.params
  const response = await axios.post(
    `${BASE_URL}/v1_0/apiuser/${referenceId}/apikey`,
    {},
    {
      headers: {
        "Ocp-Apim-Subscription-Key": PRIMARY_KEY,
        "Content-Type": "application/json",
      },
    }
  )
  res.status(StatusCodes.OK).json({msg: response.data})
}
