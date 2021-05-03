import express from 'express';
import jwt from 'jsonwebtoken';


let TokenVarifier = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).json({
                errors : [
                    {
                        msg: 'No Token Provided. Access Denied'
                    }
                ]
            });
        }
        let secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        if (typeof token=== "string" && secretKey) {
            let decode:any = jwt.verify(token, secretKey);
            req.headers['user'] = decode.user;
            next();
        }
        
    } catch (error) {
        return res.status(500).json({
            errors : [
                {
                    msg: 'Invalid Token. Access Denied'
                }
            ]
        });
        
    }
}

export default TokenVarifier;