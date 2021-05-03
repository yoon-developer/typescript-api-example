import mongoose, {Document} from 'mongoose';

export interface IUser extends Document {
    _id?: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    isAdmin: boolean;
    createAt?: string;
    updateAt?: string;
}