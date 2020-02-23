import { Prisma } from './generated/prisma-client';
import { prismaObjectType } from 'nexus-prisma';
import { objectType, subscriptionField } from 'nexus';

export interface Context {
	prisma: Prisma;
}

export const Post = prismaObjectType({
	name: 'Post',
	description: 'Message posted',
	definition(t) {
		t.prismaFields(['*']);
	}
});

export const PostSubscriptionPayload = objectType({
	name: 'PostSubscriptionPayload',
	description: 'The payload of a message subscription',
	definition(t) {
		t.field('node', {
			type: Post,
			nullable: true
		});
	}
});

export const MessageSubscription = subscriptionField('post', {
	type: PostSubscriptionPayload,
	description: 'Subscription field configuration',
	subscribe: (root, args, context) => {
		return context.prisma.$subscribe.post({
			mutation_in: 'CREATED',
			node: { content_contains: '#track' }
		});
	},
	resolve: payload => {
		return payload;
	}
});
