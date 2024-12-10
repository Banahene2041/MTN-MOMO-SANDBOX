import { Router } from "express";
import { generateAccessToken, getAccountBalance, getPaymentStatus, getRequestToPayTransactionStatus, requestPayment } from "../../controllers/collection/requestPayment.js";
const router = Router()


router.post('/request-payment',requestPayment)
router.post('/token',generateAccessToken)
router.get('/check-status/:referenceId',getRequestToPayTransactionStatus)
router.get('/account-balance',getAccountBalance)
router.get('/payment-status/:referenceId',getPaymentStatus)

export default router