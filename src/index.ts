import * as express from 'express';
const app = express();
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { User, UserService } from './UserService';
import { Message, MessageService } from './MessageService';
import { ServiceError } from './Model';

const userService = new UserService();
const messageService = new MessageService();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../static')));

// =================================   MESSAGES   =================================

app.get('/api/messages', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  console.info(req.query);
  const from = req.query.from as string;
  const to = req.query.to as string;
  const result = await messageService.list(from, to).catch(next);
  res.status(200);
  res.json(result);
});

app.post('/api/messages', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  console.info(req.body);
  const message = req.body as Message;
  // TODO validation?
  const saved = await messageService.set(message).catch(next);
  return res.status(200).json(saved);
});


app.get('/api/messages/:id', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  const messageId = req.params.id
  const message = await messageService.get(messageId).catch(next);
  return res.status(message ? 200 : 404).json(message);;
});


app.put('/api/messages/:id', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  const messageId = req.params.id
  const message = req.body as User;
  const saved = await userService.update(messageId, message).catch(next);
  res.status(200).json(saved);
});

app.delete('/api/messages/:id', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  const messageId = req.params.id
  const message = await messageService.delete(messageId).catch(next);
  return res.status(204).json(message);;
});


// =================================   USERS   =================================

app.post('/api/users', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  console.info(req.body);
  const user = req.body as User;
  const saved = await userService.set(user).catch(next);
  res.status(200);
  res.json(saved);
});

app.get('/api/users/:id', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  const userId = req.params.id
  const user = await userService.get(userId).catch(next);
  res.status(user ? 200 : 404);
  res.json(user);
});

app.put('/api/users/:id', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  const userId = req.params.id
  const user = req.body as User;
  const saved = await userService.update(userId, user).catch(next);
  res.status(200).json(saved);
});

app.get('/api/users', async (_req: express.Request, res: express.Response, next:express.NextFunction) => {
  const users = await userService.list().catch(next);
  res.status(200);
  res.json(users);
});

app.delete('/api/users/:id', async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  const userId = req.params.id
  await userService.delete(userId).catch(next);
  return res.status(204);
});

app.use((error:Error, _req: express.Request, res: express.Response, _next:express.NextFunction) => {
  if(error){
    if(error instanceof ServiceError){
      return res.status(error.code).json({ error })
    } else {
      return res.status(500).json({ error })
    }
  }
  return res.status(500).json({ error })
  }
);

app.listen(process.env.PORT || 3000);

