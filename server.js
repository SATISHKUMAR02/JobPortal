// const express = require('express')
const express = require('express')
const dotenv = require('dotenv');
const connectDB = require('./config/db.js')
const tesrroute = require('./routers/testRouter.js')
const authRoute = require('./routers/authRoutes.js')
const userRoute = require('./routers/userRoutes.js')
const jobRoute =  require('./routers/jobRoutes.js')
const userAuth = require('./middlewares/authMiddleware.js')
const cors = require('cors');
const morgan = require('morgan');
const {errorMiddleware} = require('./middlewares/errorMiddleware.js');

dotenv.config();
connectDB();
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.get('/',(req,res)=>{
    res.json({'message':'server running'})
})
app.use('/api/v1/test',tesrroute);
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/user',userAuth,userRoute);
app.use('/api/v1/jobs',userAuth,jobRoute);

app.use(errorMiddleware)

app.listen(process.env.PORT,()=>{
    console.log(`server running on 8080 ${process.env.DEV_MODE}`)
})