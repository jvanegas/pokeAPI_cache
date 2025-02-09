import Fastify from 'fastify';
import fastifyRedis from '@fastify/redis';
import healthCheckRoutes from './health-checks/routes.js';
import pokemonsRoutes from './poke-api/pokemon/routes.js';

type ConfigApp = {
  port: number;
  redisHost: string;
  redisPort: number;
};

const main = async (configApp: ConfigApp) => {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
        },
      },
    },
  });

  // Register plugins
  await app.register(fastifyRedis, {
    host: configApp.redisHost,
    port: configApp.redisPort,
  });

  // Register app routes
  app.register(healthCheckRoutes, { prefix: '/health' });
  app.register(pokemonsRoutes);

  return app;
};

const serverConfig = {
  port: parseInt(process.env.PORT as string, 10) ?? 8000,
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT as string, 10) ?? 6379,
};
const server = await main(serverConfig);

try {
  await server.listen({ port: serverConfig.port });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

export { main };
