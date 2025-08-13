import { Optional } from 'sequelize';
import { UserAttributes } from './userAttributes.type';

export type UserCreationAttributes = Optional<UserAttributes, "id">;