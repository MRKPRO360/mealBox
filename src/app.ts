import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
const app: Application = express();

app.use(
  cors({
    origin: 'localhost:5000',
    credentials: true,
  }),
);

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World! 👋' });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
