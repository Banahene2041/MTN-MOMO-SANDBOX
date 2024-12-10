import { Router } from "express";
import { createDisbursementUser, generateDisbursementApiKey, getDisbursementUser } from "../controllers/createDisbursementUser.js";
const router = Router()

router.post('/api-disburse-user',createDisbursementUser)
router.get('/api-disburse-user/:referenceId',getDisbursementUser)
router.post('/api-disburse-user/:referenceId',generateDisbursementApiKey)

export default router