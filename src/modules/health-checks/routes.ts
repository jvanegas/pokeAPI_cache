import { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/server', (_request, reply) => {
    reply.status(200).send({ status: 'Ok' });
  });

  app.get('/cache-system', (_request, reply) => {
    try {
      app.redis.set('test', 'test');
      app.redis.del('test');
      reply.status(200).send({ status: 'Ok' });
    } catch (err) {
      app.log.error(err);
      reply.status(200).send({ status: 'Error' });
    }
  });
};
