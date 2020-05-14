import { IPlayer, PlayersDatabase, PlayerEvents } from "./players.database";
import { pubsub } from "../server";

export const resolvers = {
    Query: {
        getPlayers: async (
            parent: any,
            args: any,
            context: { dataSources: { PDB: PlayersDatabase } },
            info: any
        ): Promise<IPlayer[]> => {
            return context.dataSources.PDB.getPlayers();
        },
    },
    Mutation: {
        registerPlayer: async (
            parent: any,
            args: { data: { nickName: string } },
            context: { dataSources: { PDB: PlayersDatabase } },
            info: any
        ): Promise<IPlayer> => {
            return context.dataSources.PDB.registerPlayer({
                nickName: args.data.nickName,
            });
        },
        updatePlayer: async (
            parent: any,
            args: { data: { authToken: string; ready: boolean } },
            context: { dataSources: { PDB: PlayersDatabase } },
            info: any
        ): Promise<IPlayer> => {
            return context.dataSources.PDB.updatePlayer(
                args.data.authToken,
                true
            );
        },
        deletePlayer: async (
            parent: any,
            args: { authToken: string },
            context: { dataSources: { PDB: PlayersDatabase } },
            info: any
        ): Promise<Boolean> => {
            return context.dataSources.PDB.deletePlayer(args.authToken);
        },
    },
    Subscription: {
        playerUpdated: {
            subscribe: () => pubsub.asyncIterator(Object.values(PlayerEvents)),
        },
    },
};
