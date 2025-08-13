import  express  from 'express';
const router = express.Router();
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User  from '../models/user';
import { loginInputSchema } from '../schemas/loginInput.schema';
import { validateReqBody } from '../middleware/validateReqBody';
import { LoginInput } from '../types/loginInput.type';
import { SECRET } from '../util/config';

router.post('/', validateReqBody(loginInputSchema), async (req: Request<unknown, unknown, LoginInput>, res: Response): Promise<Response>=>{
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  }
  const userForToken = {
    email: user.email,
    id: user.id
  };

  const token = jwt.sign(userForToken, SECRET);

  return res.status(200).send({
    token,
    name: user.name,
    email: user.email
  });

});

export default router;