import { AccountSchema } from '@schemas/index'
import { FromSchema } from 'json-schema-to-ts';
type t = FromSchema<typeof AccountSchema>;
export interface IAccount extends t {}