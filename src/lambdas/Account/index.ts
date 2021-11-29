import { AccountSchema } from '@schemas/index';
import { handlerPath } from '@libs/handlerResolver';

export const createAccount    = {
  handler: `${handlerPath(__dirname)}/handler.createAccountHandler`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/user',
        request: {
          schemas: {
            'application/json': AccountSchema
          }
        }
      }
    }
  ]
}
export const readAccount      = {
  handler: `${handlerPath(__dirname)}/handler.readAccountHandler`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/user/{id}'
      }
    }
  ]
}
export const readAccountList  = {
  handler: `${handlerPath(__dirname)}/handler.readAccountHandler`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/user'
      }
    }
  ]
}
export const updateAccount    = {
  handler: `${handlerPath(__dirname)}/handler.updateAccountHandler`,
  events: [
    {
      httpApi: {
        method: 'put',
        path: '/user/{id}',
        request: {
          schemas: {
            'application/json': AccountSchema
          }
        }
      }
    }
  ]
}
export const deleteAccount    = {
  handler: `${handlerPath(__dirname)}/handler.deleteAccountHandler`,
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/user/{id}',
        request: {
          schemas: {
            'application/json': AccountSchema
          }
        }
      }
    }
  ]
}
