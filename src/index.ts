import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { takeScreenshots } from './utils/screenshot';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3001;
app.post('/image', async (req: Request, res: Response) => {
  const { url } = req.body;
  await takeScreenshots(url);
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
