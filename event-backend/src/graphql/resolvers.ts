import { User, Event }  from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config.js';
//import { UserAttributes } from '../types/userAttributes.type.js';
import { GraphQLError } from 'graphql';
import { handleSequelizeErrors } from '../util/handleSequelizeErrors.js';
import { ContextUser, MyContext } from '../types/context.type.js';
import { EventArgs } from '../types/eventArgs.type.js';
import { createEventInputSchema } from '../schemas/event.input.schema.js';
//import { eventToResponseFormat } from '../util/eventToResponse.js';
//import { EventAttributes } from '../types/eventAttributes.type.js';

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
     return users.map((user) => user.toJSON());
    },
    me: (_root: unknown, _args: unknown, context: MyContext) =>{
      if (!context.currentUser){
        throw new Error("Not authenticated");
      }
      return context.currentUser;
    },
    allEvents: async () => {
      const events = await Event.findAll({
        include: {
          model: User,
          attributes: ['name', 'email', 'id'],
          },
        raw: false,
        nest: true
      });
      return events.map(e => e.toJSON());
      
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
    },

    createEvent: async (_root: unknown, args: EventArgs, context: MyContext)=>
    {  
      
    if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      // 🔹 Validate args with Zod
      const parsed = createEventInputSchema.safeParse(args);
      if (!parsed.success) {
        throw new GraphQLError("Invalid input", {
          extensions: {
            code: "BAD_USER_INPUT",
            errors: parsed.error.issues, // forward zod details
          },
        });
      }

      const { name, time, description } = parsed.data;

      const userId = context.currentUser.id;

      return handleSequelizeErrors<{
        id?: number;
        name: string;
        time: string;
        description: string;
        userId: number;
        user: ContextUser | null;
      }>(async () => {
        const newEvent = await Event.create({
          name,
          time,
          description,
          userId
        });

        const data = newEvent.toJSON.bind(newEvent)() as {
          id: number;
          name: string;
          time: Date;
          description: string;
          userId: number;
          
        };
        
        
        
        return {
        ...data,
        time: data.time instanceof Date ? data.time.toISOString() : String(data.time),
        user: context.currentUser
        };
  });
    },
  },
};


export default resolvers;