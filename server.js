//import packages
import express from 'express';
//API documentation
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
//display output with background color in terminal
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';
//file import
import connectDB from './config/db.js';
//security package
import helmet from 'helmet';
import xss from 'xss-advanced';
import ExpressMongoSanitize from 'express-mongo-sanitize';
//routes import
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import errorHandling from './middleware/errorMiddleware.js';

//config
dotenv.config()
//mongodb connection 
connectDB();

//swagger api config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'JOB RECRUITMENT PLATFORM',
            description: 'Node and ExpressJs Job Portal Application '
        },
        servers: [
            {
                url: 'http://localhost:5506'
            }

        ]
    },
    apis: ['./routes/*.js'],
};
const spec = swaggerJsDoc(options);
//rest object
const app = express();
//security
app.use(helmet());
app.use(xss());
app.use(ExpressMongoSanitize());
//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
//home route 
app.use('/api-jsdoc', swaggerUi.serve, swaggerUi.setup(spec));

//validation middleware
app.use(errorHandling);
//port
const PORT = process.env.PORT || 5506;
//listen
app.listen(PORT, () => {
    console.log(`Server currently running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgMagenta.white);
});
