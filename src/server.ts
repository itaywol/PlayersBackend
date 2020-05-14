import { ApolloServer, gql } from "apollo-server";
import { PlayersDatabase } from "./players/players.database";
import { typeDefenitions } from "./players/players.schema";
import { resolvers } from "./players/players.resolver";
import { PubSub } from "apollo-server";

export const pubsub = new PubSub();

const PDB = new PlayersDatabase(pubsub);

const server: ApolloServer = new ApolloServer({
    typeDefs: typeDefenitions,
    resolvers: resolvers,
    context: ({ req, connection }) => {
        if (connection) {
            return { ...connection.context, dataSources: { PDB } };
        } else {
            const token = req.headers.authorization || "";

            return { token, dataSources: { PDB } };
        }
    },
});

server
    .listen({ port: process.env.PORT })
    .then(() => console.log(`Apollo server running at ${process.env.PORT}`));

