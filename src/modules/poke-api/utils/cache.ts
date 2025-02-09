import { FastifyInstance } from 'fastify';

export const cacheCheck = async (
  app: FastifyInstance,
  resource: string,
  name: string,
) => {
  try {
    const cacheRegistry = app.redis.get(`${resource}:${name}`);
    return cacheRegistry;
  } catch (err) {
    app.log.error(err);
    return { status: 'Error' };
  }
};

export const cacheSet = async (
  app: FastifyInstance,
  resource: string,
  name: string,
  data,
) => {
  try {
    app.redis.set(`${resource}:${name}`, JSON.stringify(data), 'EX', 3600);
  } catch (err) {
    app.log.error(err);
  }
};
