import { Request } from 'express';
import { User } from '../modules/users/interfaces/user.interface';

export interface IRequest extends Request {
  user: User
}