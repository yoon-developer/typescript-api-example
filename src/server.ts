import express from 'express';
import userRouter from './router/userRouter';
import appLogger from './middleware/appLogger';

const app: express.Application = express();

const hostname: string = '127.0.0.1';
const port: number = 5000;

// configure middleware
app.use(appLogger);

// configure express to receive form data
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// router configuration
app.use('/users', userRouter);

app.listen(port, hostname, () => console.log(`Express Server is started at http://${hostname}:${port}`));