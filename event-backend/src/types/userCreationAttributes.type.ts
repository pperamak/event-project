import { Optional } from 'sequelize';
import { UserAttributes } from './userAttributes.type.js';

export type UserCreationAttributes = Optional<UserAttributes, "id">;