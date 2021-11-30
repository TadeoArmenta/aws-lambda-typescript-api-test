import MongooseConnector from '@db/client';
import {AccountModel} from '@db/models/accountModel';
import {IAccount} from '@entities/IAccount';
import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import {AccountSchema} from '@schemas/index';

let dbSession;
const createDbSession = async() => {
    await MongooseConnector.connectToDatabase();
    return await MongooseConnector.startSession();
}
/**
 * create account handler
 * */
const createAccountLambda: ValidatedEventAPIGatewayProxyEvent<typeof AccountSchema> = async(event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const response: {[key: string]: unknown} = {};
    const data: IAccount = event.body
    try {
        if (!dbSession) dbSession = await createDbSession();
        response.message = await (new AccountModel(data)).save();
    } catch (error) {
        response.message = error.message
    }
    return formatJSONResponse(response);
}
/**
 * Read Accounts handler
 * */
const readAccountLambda: ValidatedEventAPIGatewayProxyEvent<typeof AccountSchema> = async(event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const response: {[key: string]: unknown} = {};
    try {
        if (!dbSession) dbSession = await createDbSession();
        const {id} = event.pathParameters ? event.pathParameters : {id: null};
        if (id) {
            response.message = await AccountModel.findById(id).lean();
        } else {
            response.message = await AccountModel.find().lean();
        }
    } catch (error) {
        response.message = error.message
    }
    return formatJSONResponse(response);
}
/**
 * Update Accounts handler
 * */
const updateAccountLambda: ValidatedEventAPIGatewayProxyEvent<typeof AccountSchema> = async(event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const response: {[key: string]: unknown} = {};
    const data: IAccount = event.body
    try {
        if (!dbSession) dbSession = await createDbSession();
        const {id} = event.pathParameters ? event.pathParameters : {id: null};
        response.message = await AccountModel.findByIdAndUpdate(id, data,{new: true}).lean();
    } catch (error) {
        response.message = error.message
    }
    return formatJSONResponse(response);
}
/**
 * Delete Account handler
 * */
const deleteAccountLambda: ValidatedEventAPIGatewayProxyEvent<typeof AccountSchema> = async(event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const response: {[key: string]: unknown} = {};
    try {
        if (!dbSession) dbSession = await createDbSession();
        const {id} = event.pathParameters ? event.pathParameters : {id: null};
        response.message = await AccountModel.findByIdAndDelete(id, {projection: 'Object'}).lean();
    } catch (error) {
        response.message = error.message
    }
    return formatJSONResponse(response);
}

export const createAccountHandler       = middyfy(createAccountLambda);
export const readAccountHandler         = middyfy(readAccountLambda);
export const updateAccountHandler       = middyfy(updateAccountLambda);
export const deleteAccountHandler       = middyfy(deleteAccountLambda);
