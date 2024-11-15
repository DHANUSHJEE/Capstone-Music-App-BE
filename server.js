import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import router from './routes/userRoute.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Enable CORS
app.use(cors());

app.use(morgan("dev"));
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use('/api/user', router);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
