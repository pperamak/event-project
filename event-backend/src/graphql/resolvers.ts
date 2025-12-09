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
import cloudinary from '../util/cloudinary.js';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../util/config.js';
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
      return events.map(e => ({...e.toJSON(), time: e.time instanceof Date ? e.time.toISOString() : String(e.time)}));
      
    },
    findEvent: async (_root: unknown, args: { id: string}) => {
      const event = await Event.findByPk(args.id, {
        include: {
          model: User,
          attributes: ['name', 'email', 'id'],
        },
      });

      if (!event) {
        throw new Error(`Event with ID ${args.id} not found`);
      }
      const data = event.toJSON();
      return { 
        ... data,
        time: data.time instanceof Date ? data.time.toISOString() : String(data.time)
      };
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
      const parsed = createEventInputSchema.safeParse(args.input);
      if (!parsed.success) {
        throw new GraphQLError("Invalid input", {
          extensions: {
            code: "BAD_USER_INPUT",
            errors: parsed.error.issues, // forward zod details
          },
        });
      }

      const { name, time, description, image, latitude, longitude, address } = parsed.data;

      const userId = context.currentUser.id;

      return handleSequelizeErrors<{
        id?: number;
        name: string;
        time: string;
        description: string;
        image: string;
        latitude: number;
        longitude: number;
        address: string;
        userId: number;
        user: ContextUser | null;
      }>(async () => {
        const newEvent = await Event.create({
          name,
          time,
          description,
          userId,
          image,
          latitude,
          longitude,
          address
        });

        const data = newEvent.toJSON.bind(newEvent)() as {
          id: number;
          name: string;
          time: Date;
          description: string;
          userId: number;
          image: string;
          latitude: number;
          longitude: number;
          address: string;
        };
        
        
        
        return {
        ...data,
        time: data.time instanceof Date ? data.time.toISOString() : String(data.time),
        user: context.currentUser
        };
  });
    },
      getCloudinarySignature: () => {
      const timestamp = Math.round(new Date().getTime() / 1000);

      const signature = cloudinary.utils.api_sign_request(
        { timestamp: timestamp,
          folder: "events"
         },
        CLOUDINARY_API_SECRET
      );

      return {
        signature,
        timestamp,
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY
      };
    },
  },
};


export default resolvers;