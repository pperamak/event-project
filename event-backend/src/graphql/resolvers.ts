import User  from '../models/user';


const resolvers = {
  Query: {
    allUsers: async () => {
     const users = await User.findAll();
     return users.map((user) => user.toJSON());;
    }
  }
};

export default resolvers;