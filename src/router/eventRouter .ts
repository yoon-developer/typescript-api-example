import express from 'express';
import TokenVarifier from '../middleware/TokenVerifier';
import { check, validationResult } from 'express-validator';
import { IEvent } from './../model/IEvent';
import Event from './../model/Event';


const eventRouter: express.Router = express.Router();

/**
 * @usage: Upload an Event
 * @url: http://{HOST_NAME}:{PORT}/events/upload
 * @method: POST
 * @fields: name, image, price, date, info, type
 * @access: PRIVATE
 */
eventRouter.post('/upload', [
    check('name').not().isEmpty().withMessage('Name is Required'),

    check('image').not().isEmpty().withMessage('Image is Required'),

    check('price').not().isEmpty().withMessage('Price is Required'),

    check('date').not().isEmpty().withMessage('Date is Required'),

    check('info').not().isEmpty().withMessage('Info is Required'),

    check('type').not().isEmpty().withMessage('Type is Required'),
],TokenVarifier,async (req: express.Request, res: express.Response) => {

    let errors = validationResult(res);

    if (!errors.isEmpty) {
        return res.status(400).json({
            errors : errors.array()
        });
    }

    try {

        let { name, image, price, date, info, type } = req.body; // to receive the form data from client

        // check if event with the same name;
        let event: IEvent | null = await Event.findOne({name: name});
        if (event) {
            return res.status(400).json({
                errors : [
                    {
                        msg: 'Event is Already Exists'
                    }
                ]
            });
        }

        // create an event
        event = new Event({name, image, price, date, info, type});
        event = await event.save();

        res.status(200).json({
            msg : 'Upload Event is Success'
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        })
    }

});

/**
 * @usage: Get All FREE Events
 * @url: http://{HOST_NAME}:{PORT}/events/free
 * @method: GET
 * @fields: no-fields
 * @access: PUBLIC
 */
eventRouter.get('/free', async (req: express.Request, res: express.Response) => {
    try {

        let events: IEvent[] | null = await Event.find({type: "FREE"});
        if (!events) {
            return res.status(400).json({
                errors : [
                    {
                        msg: 'No Events Found'
                    }
                ]
            })
        }


        res.status(200).json({
            events: events
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        })
    }

});

/**
 * @usage: Get All PRO Events
 * @url: http://{HOST_NAME}:{PORT}/events/pro
 * @method: GET
 * @fields: no-fields
 * @access: PUBLIC
 */
eventRouter.get('/pro', async (req: express.Request, res: express.Response) => {
    try {

        let events: IEvent[] | null = await Event.find({type: "PRO"});
        if (!events) {
            return res.status(400).json({
                errors : [
                    {
                        msg: 'No Events Found'
                    }
                ]
            })
        }

        res.status(200).json({
            events: events
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        })
    }

});

/**
 * @usage: Get a single Event
 * @url: http://{HOST_NAME}:{PORT}/events/:eventId
 * @method: GET
 * @fields: 
 * @access: PUBLIC
 */
eventRouter.get('/:eventId', async (req: express.Request, res: express.Response) => {
    try {

        let events: IEvent | null = await Event.findById(req.params.eventId);
        if (!events) {
            return res.status(400).json({
                errors : [
                    {
                        msg: 'No Events Found'
                    }
                ]
            })
        }

        res.status(200).json({
            events: events
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [
                {
                    msg: error
                }
            ]
        })
    }

});

export default eventRouter;