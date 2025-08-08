import express from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const router = express.Router();

const newUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string()
});

type NewUser = z.infer<typeof newUserSchema>;

const toNewUser = (object: unknown): NewUser =>{
  return newUserSchema.parse(object);
};

router.post('/', async (req, res) =>{
 // const { name, email, password } = req.body;
try{
  const newUser = toNewUser(req.body);
  
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
  console.log(newUser.name, newUser.email, passwordHash);
  res.send('Creating a user..');
  //save user
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

