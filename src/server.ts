import express from 'express';
import cors from 'cors';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './router/userRouter';
import eventRouter from './router/eventRouter ';
import appLogger from './middleware/appLogger';

const app: express.Application = express();

// cors
app.use(cors());

// configure middleware
app.use(appLogger);

// configure express to receive form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// configure dotEnv
dotEnv.config({ path: __dirname + '/.env' });

const hostname: string | undefined = process.env.HOST_NAME
const port: string | undefined = process.env.PORT;

// connect MongoDB
let dbURL: string | undefined = process.env.MONGO_DB_LOCAL;
if (dbURL) {
    mongoose.connect(dbURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true
    }).then((response) => {
        console.log('Connected to MongoD SuccessFully...')
    }).catch((error) => {
        console.error(error);
        process.exit(1); // stop the node js process
    });
};

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(
        `<h3 style="font-family: Lato, sans-serif; color: teal">Welcome to Events Now Booking Application Backend</h3>`

    )


});

// router configuration
app.use('/users', userRouter);
app.use('/events', eventRouter);

if (port && hostname) {
    app.listen(Number(port), hostname, () => {
        console.log(`Express Server is started at http://${hostname}:${port}`);
    })
}