import { Schema, model } from "mongoose";
import { IAccount } from "@entities/index";

const AccountMongooseSchema = new Schema<IAccount>({
    userName        : { type: String, required: true, unique:true },
    firstName       : { type: String },
    lastName        : { type: String },
    age             : { type: Number },
});

AccountMongooseSchema
    .set('toObject', { virtuals: true })
    .set('toJSON', { virtuals: true })
    .set('timestamps', { currentTime: () => Date.now() })
    .set('collection', 'accounts');

export const AccountModel = model<IAccount>('Account', AccountMongooseSchema);
