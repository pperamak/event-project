import User  from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config.js';
//import { UserAttributes } from '../types/userAttributes.type.js';
import { GraphQLError } from 'graphql';
import { handleSequelizeErrors } from '../util/handleSequelizeErrors.js';
import { MyContext } from '../types/context.type.js';

interface CreateUserArgs {
  name: string;
  email: string;
  password: string;
}


interface LoginArgs {
  email: string;
  password: string
}



const resolvers = {
  Query: {
    allUsers: async () => {
     const users = await User.findAll();
     return users.map((user) => user.toJSON());;
    },
    me: (_root: unknown, _args: unknown, context: MyContext) =>{
      if (!context.currentUser){
        throw new Error("Not authenticated");
      }
      return context.currentUser;
    }
  },
  Mutation: {
    createUser: async (_root: unknown, args: CreateUserArgs) =>{
      return handleSequelizeErrors(async () =>{
        const { name, email, password } =args;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = {
          name,
          email,
          passwordHash
          };
        const savedUser = await User.create(newUser);

        return savedUser.toSafeJSON();
      });     
    },

    login: async (_root: unknown, args: LoginArgs) => {
      const { email, password } = args;
      const user = await User.findOne({ where: { email } });
      if (!(user && (await bcrypt.compare(password, user.passwordHash)))) {
        throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      });
      }
      
      const userForToken = {
        email: user.email,
        id: user.id
      };

      const token = jwt.sign(userForToken, SECRET);
      return { 
        value: token,
        user: user.toSafeJSON() 
      };
    }
  }
};


export default resolvers;