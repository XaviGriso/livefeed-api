# LIVEFEED API

## Intro

This is an example GraphQL API built with Typescript, Prisma, Nexus and Nexus-Prisma.
The API has a Code-First approach rather than SDL-first, and the same can be said about the data layer.

Specifically, Prisma is the ORM mapping the database entities defined in `prisma/datamodel.prisma`.
The entities can be deployed to a specific database or to an online service, and any structural change in the datamodel will be reflected in the database, making the data driven by the entities in the datamodel and not viceversa.

Nexus is a code-first GraphQL API. That means that rather than defining the schema first, and write the types, queries, mutations later, we can write the resolvers we need and the schema will be automatically generated.

Nexus-Prisma links the Prisma ORM with the Nexus approach, making available the types defined in the datamodel as GraphQL types, and also providing for free a lot of predefined CRUD operations that we may or may not include in our schema, saving a ton of boilerplate and days if not weeks of work.

The data defined in Prisma will effectively drive the data store and the API shape being our source of truth, without preventing us to add custom types or other GraphQL objects.

## Livefeed API

Leveraging the tech described earlier, this simple API will allow to create a simple POST entity (defined in `datamodel.prisma`):

```
type Post {
  id: ID! @id`
  author: String!
  content: String!
}
```

and the `prismaObjectTypes` defined in `schema.ts` allow us to create all the CRUD operations for all the defined entities (in our case just Post) with a few lines of code. The operations also support filtering, sorting etc. all out of the box.

In `types.ts` we have two custom types to define a GraphQL subscription. In this example we want to be able to expose a websocket that the client can use to receive livefeed notifications whenever a specific message gets posted.
The two types are the subscription payload `PostSubscriptionPayload` and the subscription field itself `MessageSubscription`.
Subscribing to a post that contains a specific string is very easy with Prisma, and it is achieved with a few lines of code:

```
return context.prisma.$subscribe.post({
	mutation_in: 'CREATED',
	node: { content_contains: '#track' }
});
```

Finally, in `schema.ts` we put everything together with `makePrismaSchema`.

## Test it

Just run: `yarn start` and connect to `http://localhost:4000/graphql`.
You can then browse the schema to see all of the operations.

To listen to the new messages tagged with `#track` you can run:

```
subscription {
  post {
    node {
      id
      author
      content
    }
  }
}
```

that will open a web socket and listen for the desired messages.

In a new tab you can create new posts with the mutation:

```
mutation {
  createPost(data: {
    author: "Author Name"
    content: "#track this message"
  }) {
    id
  }
}
```

Once you run it, you can switch to the subscription tab and see that it intercepted it.
You can remove the tag `#track` and verify that it won't intercept it this time.
