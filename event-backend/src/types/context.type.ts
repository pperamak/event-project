export interface ContextUser {
  id: number;
  name: string;
  email: string;
}

export interface MyContext {
  currentUser: ContextUser | null;
}