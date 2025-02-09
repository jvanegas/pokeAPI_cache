import { FastifyReply } from 'fastify';

export const checkAuthorized = (apiKey: string, reply: FastifyReply) => {
  if (apiKey !== process.env.API_KEY) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
};
