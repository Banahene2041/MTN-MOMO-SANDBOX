import * as dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import express from 'express'
const app = express()
const { PORT } = process.env
import morgan from 'morgan'

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// importing routes
import userRoute from './routes/createUser.js'
import disburseRoute from './routes/createDisbursementUser.js'
import requestPaymentRoute from './routes/collection/requestPayment.js'
import disburseRequestRoute from './routes/disbursement/requestTransfer.js'
app.use('/api/v1',userRoute)
app.use('/api/v1',disburseRoute)
app.use('/api/v1',requestPaymentRoute)
app.use('/api/v1',disburseRequestRoute)

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'

if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"))
}

app.use('*',(req,res)=> {
    res.status(404).json({msg: "not found"})
})

app.use(errorHandlerMiddleware)

app.listen(PORT,()=>console.log(`Server is listening on port: ${PORT}`))