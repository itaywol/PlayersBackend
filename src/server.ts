import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
    type Query {
        testMessage: String!
    }
`;

const resolvers = {
    Query: {
        testMessage: (): void => console.log("this is a test message"),
    },
};

const server: ApolloServer = new ApolloServer({ typeDefs, resolvers });

server
    .listen({ port: process.env.PORT })
    .then((url) => console.log(`Apollo server running at ${url}`));

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log("Module disposed."));
}
