import { IUser } from './../model/IUser';
import express, { response } from 'express';
import { check, validationResult } from 'express-validator';
import User from './../model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import TokenVerifier from '../middleware/TokenVerifier';

const userRouter: express.Router = express.Router();

userRouter.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        msg: 'From User Router'
    });
});

/**
 * @usage: Register a User
 * @url: http://{HOST_NAME}:{PORT}/users/register
 * @method: POST
 * @fields: name, email, password
 * @access: PUBLIC
 */
userRouter.post('/register', [
    // fields validation
    check('name')
        .isLength({ min: 1 }).trim()
        .withMessage('Username cannot be empty.')
        .matches(/^[a-zA-Z0-9_]+$/, 'i').withMessage('Username must be alphanumeric, and can contain underscores'),

    check('email')
        .isEmail()
        .withMessage('Proper Email is Required'),

    check('password')
        .isLength({ min: 5, max: 18 })
        .withMessage('Password must be between 5-18 characters long.')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
        .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),
], async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {

        let { name, email, password } = req.body; // to receive the form data from client


        // check if the email is exists
        let user: IUser | null = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                errors: [
                    { mag: 'User is Already Exists' }
                ]
            });
        }

        // encrypt the password
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // get avatar url
        let avatar = gravatar.url(email, {
            s: '300',
            r: 'pg',
            d: 'mm'
        });

        // register the user
        user = new User({ name, email, password, avatar });
        user = await user.save();


        res.status(200).json({
            msg: 'Registration is Success'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        });
    }

});

/**
 * @usage: Login a User
 * @url: http://{HOST_NAME}:{PORT}/users/login
 * @method: POST
 * @fields: email, password
 * @access: PUBLIC
 */
userRouter.post('/login', [
    // fields validation
    check('email').not().isEmpty().withMessage('Email is Required'),

    check('password').not().isEmpty().withMessage('Password is Required'),
], async (req: express.Request, res: express.Response) => {
    try {

        let { email, password } = req.body; // to receive the form data from client

        // check for email
        let user: IUser | null = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                errors: [
                    { mag: 'Invalid Email' }
                ]
            });
        }

        // check for password
        let isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [
                    { mag: 'Invalid Password' }
                ]
            });
        }

        // create a token
        let payload: any = {
            user: {
                id: user.id,
                name: user.name
            }
        };
        let secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        if (secretKey) {
            let token = jwt.sign(payload, secretKey);
            res.status(200).json({
                msg: 'Login of a user',
                token: token
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        });
    }

});

/**
 * @usage: Get User Info
 * @url: http://{HOST_NAME}:{PORT}/users/me
 * @method: GET
 * @fields: no-fields
 * @access: PRIVATE
 */
userRouter.get('/me', TokenVerifier, async (req: express.Request, res: express.Response) => {
    try {
        
        let reqUser: any = req.headers['user'];
        let user: IUser | null = await User.findById(reqUser.id);
        if (!user) {
            return res.status(400).json({
                errors : [
                    {
                        msg: 'User data not found'
                    }
                ]
            })
        }

        res.status(200).json({
            user: user
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        });
    }

});

export default userRouter;