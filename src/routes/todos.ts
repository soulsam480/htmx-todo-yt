import { FastifyPluginAsync } from 'fastify';

// let's setup a dummy db which persists in HMR

interface Todo {
  title: string;
  done: boolean;
}

const todosDb: Todo[] = [];

function renderTodos(todos: Todo[]) {
  return todos
    .map((todo, i) => {
      // delete this todo when clicked on the X button
      // then swap the returned data inside the todos list element
      return `<li ${
        todo.done ? 'style="text-decoration: line-through;"' : ''
      }><span>${
        todo.title
      }</span> <button hx-delete="/api/todos/${i}" hx-target="#todo-list">X</button></li>`;
    })
    .join(' ');
}

/**
 * What do we need from API
 * TODO:
 * - Create
 * - read
 * - update
 * - delete
 */
export const todos: FastifyPluginAsync = async (app) => {
  // return all todos
  app.get('/', (_, reply) => {
    reply.send(renderTodos(todosDb));
  });

  app.post<{ Body: { title: string } }>('/', ({ body: { title } }, reply) => {
    reply.header('Content-Type', 'text/html');

    // we add the new todo
    todosDb.push({ title, done: false });

    // retrun all the todos
    reply.send(renderTodos(todosDb));
  });

  app.delete<{ Params: { id: string } }>(
    '/:id',
    ({ params: { id } }, reply) => {
      reply.header('Content-Type', 'text/html');

      // remove at index
      todosDb.splice(parseInt(id), 1);

      // retrun all the todos
      reply.send(renderTodos(todosDb));
    },
  );
};
