import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import hostelRouter from './routes/hostel.routes.js';
import reviewRouter from './routes/review.routes.js';
import bookmarkRouter from './routes/bookmark.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: true,
  credentials: true, // This is required to allow cookies with CORS
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/hostels', hostelRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookmarks', bookmarkRouter);

export default app;
