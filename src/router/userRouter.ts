import express from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';

const userRouter: express.Router = express.Router();

/*
    @method : get
    @fields : none
    @access : public
*/
userRouter.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`
    <h3 style="font-family: Lato.sans-serif; color: cadetblue">
        Welcome to User Router
    </h3>
    `);
});

/*
    @method : post
    @fields : name, password, email
    @access : public
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
        return res.status(400).json({ errors: errors.array() })
    }

    let { name, email, password } = req.body; // to receive the form data from client

    try {
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        res.status(200).send({
            user: { name, email, password },
            hashedPassword: hashedPassword,
        });


    } catch (error) {
        console.log(error);
    }

});

export default userRouter;