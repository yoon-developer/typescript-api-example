import express from 'express';

let appLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // url, method, data, time
    let url = req.url;
    let method = req.method;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let result:string = `[${url}] [${method}] - [${date}] - [${time}]]`
    console.log(result);
    next(); // mandatory & last line
};

export default appLogger;