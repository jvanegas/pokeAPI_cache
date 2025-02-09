import { FastifyInstance } from 'fastify';
import { checkAuthorized } from '../../../shared/auth/index.js';
import { cacheCheck, cacheSet } from '../utils/cache.js';
import { getPokemonByName, getAbilityByName } from './services.js';

type ResourceByNameParams = {
  name: string;
};

const ResourceByNameSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
};

export default async (app: FastifyInstance) => {
  app.get<{ Params: ResourceByNameParams }>(
    '/pokemon/:name',
    {
      schema: { params: ResourceByNameSchema },
      preValidation: async (request, reply) => {
        checkAuthorized(request.headers['x-api-key'] as string, reply);
      },
      preHandler: async (request, reply) => {
        const cache = await cacheCheck(app, 'pokemon', request.params.name);
        if (cache) reply.type('application/json').status(200).send(cache);
        else app.log.info('No valid cache found');
      },
    },
    async (request, reply) => {
      const { name } = request.params;
      try {
        const { body } = await getPokemonByName(name);
        // Save cache
        await cacheSet(app, 'pokemon', name, body);
        reply.status(200).send(body);
      } catch (err) {
        app.log.error(err);
        reply.status(500).send({ status: 'Error' });
      }
    },
  );

  app.get<{ Params: ResourceByNameParams }>(
    '/ability/:name',
    {
      schema: { params: ResourceByNameSchema },
      preValidation: async (request, reply) => {
        checkAuthorized(request.headers['x-api-key'] as string, reply);
      },
      preHandler: async (request, reply) => {
        const cache = await cacheCheck(app, 'ability', request.params.name);
        if (cache) reply.type('application/json').status(200).send(cache);
        else app.log.info('No valid cache found');
      },
    },
    async (request, reply) => {
      const { name } = request.params;
      try {
        const { body } = await getAbilityByName(name);
        // Save cache
        await cacheSet(app, 'ability', name, body);
        reply.status(200).send(body);
      } catch (err) {
        app.log.error(err);
        reply.status(500).send({ status: 'Error' });
      }
    },
  );
};
