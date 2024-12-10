import { Router } from "express";
import { createUser, generateAPIKey, getUser } from "../controllers/createUser.js";
const router = Router()


router.post('/apiuser',createUser)
router.get("/apiuser/:referenceId", getUser)
router.post("/apiuser/:referenceId", generateAPIKey)


export default router