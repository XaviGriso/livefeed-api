import { makePrismaSchema, prismaObjectType } from 'nexus-prisma';
import * as path from 'path';
import datamodelInfo from './generated/nexus-prisma';
import { prisma } from './generated/prisma-client';
import { Post, PostSubscriptionPayload, MessageSubscription } from './types';

const Query = prismaObjectType({
	name: 'Query',
	definition: t => t.prismaFields(['*'])
});

const Mutation = prismaObjectType({
	name: 'Mutation',
	definition: t => t.prismaFields(['*'])
});

export const schema = makePrismaSchema({
	types: [Query, Mutation, Post, PostSubscriptionPayload, MessageSubscription],

	prisma: {
		datamodelInfo,
		client: prisma
	},

	outputs: {
		schema: path.join(__dirname, './generated/schema.graphql'),
		typegen: path.join(__dirname, './generated/nexus.ts')
	},

	// Configure nullability of input arguments: All arguments are non-nullable by default
	nonNullDefaults: {
		input: false,
		output: false
	},

	// Configure automatic type resolution for the TS representations of the associated types
	typegenAutoConfig: {
		sources: [
			{
				source: path.join(__dirname, './types.ts'),
				alias: 'types'
			}
		],
		contextType: 'types.Context'
	}
});
