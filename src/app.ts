import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

app.use(
  cors({
    origin: ['https://meal-app-beta-eight.vercel.app', 'http://localhost:3000'],
    credentials: true,
  }),
);

app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World! 👋' });
});

app.use('/api/v1', router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
