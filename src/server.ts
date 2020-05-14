import { ApolloServer, gql } from "apollo-server";
import { PlayersDatabase } from "./players/players.database";
import { typeDefenitions } from "./players/players.schema";
import { resolvers } from "./players/players.resolver";
import { PubSub } from "apollo-server";

export const pubsub = new PubSub();
export class PlayersServer {
    public Server: ApolloServer;
    public PlayerDatabase: PlayersDatabase;
    public playersPubSub: PubSub;
    constructor() {
        this.PlayerDatabase = new PlayersDatabase(pubsub);
        this.playersPubSub = pubsub;

        this.Server = new ApolloServer({
            typeDefs: typeDefenitions,
            resolvers: resolvers,
            context: ({ req, connection }) => {
                if (connection) {
                    return {
                        ...connection.context,
                        dataSources: { PDB: this.PlayerDatabase },
                    };
                } else {
                    const token = req?.headers?.authorization || "";

                    return { token, dataSources: { PDB: this.PlayerDatabase } };
                }
            },
        });
    }

    async launch() {
        await this.Server.listen({ port: process.env.PORT }).then(() =>
            console.log(`🚀 Apollo server running at ${process.env.PORT}`)
        );
    }

    async stop() {
        await this.Server.stop();
    }
}

const Server = new PlayersServer();
Server.launch();
