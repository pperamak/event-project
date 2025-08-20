import User  from '../models/user';
import bcrypt from 'bcrypt';

interface CreateUserArgs {
  name: string;
  email: string;
  password: string;
}

const resolvers = {
  Query: {
    allUsers: async () => {
     const users = await User.findAll();
     return users.map((user) => user.toJSON());;
    }
  },
  Mutation: {
    createUser: async (_root: unknown, args: CreateUserArgs) =>{
      const { name, email, password } =args;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const newUser = {
        name,
        email,
        passwordHash
        };
      const savedUser = await User.create(newUser);

      // hide passwordHash before returning
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...safeUser } = savedUser.toJSON();

      return safeUser;
      
    }
  }
};
/*
const { name, email, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  console.log(name, email, passwordHash);
  const newUser = {
    name,
    email,
    passwordHash
  };

   
  const savedUser = await User.create(newUser);
  console.log(savedUser);
  return res.send(savedUser.toJSON());
  */

export default resolvers;