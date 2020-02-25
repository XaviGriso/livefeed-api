import { ApolloServer } from 'apollo-server';
import { prisma } from './generated/prisma-client';
import { schema } from './schema';
import * as env from 'dotenv';

env.config();
const server = new ApolloServer({
	schema,
	context: { prisma }
});

console.log(process.env.PRISMA_ENDPOINT);

server.listen({ port: 4000 }, () =>
	console.log(`🚀 - Server ready at http://localhost:4000`)
);
