import { Router } from "express";
import { generateDisburseAccessToken } from "../../controllers/disbursement/requestTransfer.js";
const router = Router()

router.post('/disburse-token',generateDisburseAccessToken)

export default router