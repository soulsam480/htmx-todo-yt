import fastify from 'fastify';
import view from '@fastify/view';
import formBody from '@fastify/formbody';
import ejs from 'ejs';
import { join } from 'node:path';
import { todos } from './routes/todos';

async function main() {
  const app = fastify({
    logger: true,
  });

  app.register(view, {
    engine: {
      ejs,
    },
    root: join(__dirname, 'views'),
    viewExt: 'ejs',
    layout: 'layout',
  });

  app.register(formBody);

  app.get('/', (_, reply) => {
    reply.view('index', { greeting: 'This is htmx example' });
  });

  app.get('/todos', (_, reply) => {
    reply.view('todos');
  });

  await app.register(todos, {
    prefix: '/api/todos',
  });

  await app.ready();

  await app.listen({ port: 3000 });
}

void main();
