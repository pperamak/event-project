import { UserAttributes } from "./userAttributes.type.js";

export interface MyContext {
  currentUser: UserAttributes | null;
}