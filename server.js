// const express = require('express')
const express = require('express')
// API Documentation
const swaggerUI = require('swagger-ui-express')
const swagggerdoc = require('swagger-doc')


const dotenv = require('dotenv');
const connectDB = require('./config/db.js')
const tesrroute = require('./routers/testRouter.js')
const authRoute = require('./routers/authRoutes.js')
const userRoute = require('./routers/userRoutes.js')
const jobRoute = require('./routers/jobRoutes.js')
const userAuth = require('./middlewares/authMiddleware.js')
const cors = require('cors');
const morgan = require('morgan');
const { errorMiddleware } = require('./middlewares/errorMiddleware.js');
// SECURITY IMPORTS
const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');

dotenv.config();
connectDB();

// swagger api config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal",
            description: "Node Js express"
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ]
    },
    apis:["./routes/*.js"]

}




const app = express()
app.use(helmet()) // make sure this is first always

app.use(mongosanitize())
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.get('/', (req, res) => {
    res.json({ 'message': 'server running' })
})
app.use('/api/v1/test', tesrroute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userAuth, userRoute);
app.use('/api/v1/jobs', userAuth, jobRoute);

app.use(errorMiddleware)

app.listen(process.env.PORT, () => {
    console.log(`server running on 8080 ${process.env.DEV_MODE}`)
})