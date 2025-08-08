import express from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { newUserInputSchema } from '../schemas/newUserInput.schema';
import { validateReqBody } from '../middleware/validateReqBody';
import { NewUserInput } from '../types/newUserInput.type';
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

router.post('/', validateReqBody(newUserInputSchema), async (req, res) =>{
 // 
try{
  //tämä middlewareen?
  //const newUser = toNewUser(req.body);
  const { name, email, password } = req.body as NewUserInput;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  console.log(name, email, passwordHash);
  res.send('Creating a user..');
  //save user -userservice?
  //res.status(201).json(savedUser)
} catch (error: unknown) {
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
  }   
});

export default router;

