import express from 'express';

const router = express.Router();

router.post('/', (_req, res) =>{
  res.send('Creating a user..');
});

export default router;

