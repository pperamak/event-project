import express from 'express';
import bcrypt from 'bcrypt';
//import { z } from 'zod';NextFunction
import { Request, Response,  } from 'express';
import { newUserInputSchema } from '../schemas/newUserInput.schema';
import { validateReqBody } from '../middleware/validateReqBody';
import { NewUserInput } from '../types/newUserInput.type';
import { NewUser } from '../types/newUser.type';
//import { User } from '../models';
import User  from '../models/user';
const router = express.Router();
/*
const newUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string()
});

type NewUser = z.infer<typeof newUserSchema>;

const toNewUser = (object: unknown): NewUser =>{
  return newUserSchema.parse(object);
};
*/
//next: NextFunction
router.post('/', validateReqBody(newUserInputSchema), async (req: Request<unknown, unknown, NewUserInput>, res: Response<NewUser>, ) =>{
 // 
//try{
  //tämä middlewareen?
  //const newUser = toNewUser(req.body);
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
  res.send(newUser);
  //save user -userservice?
  //res.status(201).json(savedUser)
//} catch (error: unknown) {
//    next(error);
  /*
    let errorMessage = 'Something went wrong.';
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } 
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
      res.status(400).send(errorMessage);
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  */ 
 } 
   
//}
);

export default router;

