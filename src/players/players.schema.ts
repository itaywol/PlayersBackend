import { gql } from "apollo-server";

export const typeDefenitions = gql`
    type Player {
        nickName: String
        authToken: String
        ready: Boolean
    }

    input registerPlayerInput {
        nickName: String
    }

    input updatePlayerInput {
        authToken: String
        ready: Boolean
    }

    type Query {
        getPlayers: [Player]
    }

    type Mutation {
        registerPlayer(data: registerPlayerInput!): Player
        updatePlayer(data: updatePlayerInput!): Player
        deletePlayer(authToken: String!): Boolean
    }

    type Subscription {
        playerUpdated: Player
    }
`;
