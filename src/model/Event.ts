import mongoose, {Schema, Model} from 'mongoose';
import { IEvent } from './IEvent';


let eventSchema:Schema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: String, required: true},
    date: {type: String, required: true},
    info: {type: String, required: true},
    type: {type: String, required: true},
}, {timestamps: true});

let Event: Model<IEvent> = mongoose.model('event', eventSchema);

export default Event;