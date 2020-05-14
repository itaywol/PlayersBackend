import { createTestClient } from "apollo-server-testing";
import { gql, PubSub } from "apollo-server";
import { PlayersServer } from "../src/server";
import { PlayerEvents } from "../src/players/players.database";

const GET_USER = gql`
    query getPlayers {
        getPlayers {
            nickName
            authToken
            ready
        }
    }
`;

const REGISTER_USER = gql`
    mutation registerPlayer($data: registerPlayerInput!) {
        registerPlayer(data: $data) {
            nickName
            authToken
            ready
        }
    }
`;
const UPDATE_USER = gql`
    mutation updatePlayer($data: updatePlayerInput!) {
        updatePlayer(data: $data) {
            nickName
            authToken
            ready
        }
    }
`;

const DELETE_USER = gql`
    mutation deletePlayer($authToken: String!) {
        deletePlayer(authToken: $authToken)
    }
`;

describe("Queries", () => {
    const PS = new PlayersServer();

    beforeAll(async () => {
        return await PS.launch();
    });
    it("should be a list of empty users", async () => {
        const { query, mutate } = createTestClient(PS.Server);
        const res = await query({ query: GET_USER });
        expect(res.data).toEqual({ getPlayers: [] });
    });
    afterAll(async () => {
        return await PS.stop();
    });
});

describe("Mutations", () => {
    const PS = new PlayersServer();
    beforeAll(async () => {
        return await PS.launch();
    });
    it("should register one player and match his name", async () => {
        const { query, mutate } = createTestClient(PS.Server);
        const res = await mutate({
            mutation: REGISTER_USER,
            variables: { data: { nickName: "itay" } },
        });
        expect(res.data.registerPlayer.nickName).toEqual("itay");
    });

    let savedAuthToken: string | null = null;
    it("should have one player", async () => {
        const { query, mutate } = createTestClient(PS.Server);
        const res = await query({ query: GET_USER });
        expect(res.data.getPlayers.length).toBe(1);
        if (res.data.getPlayers.length > 0) {
            savedAuthToken = res.data.getPlayers[0].authToken;
        }
    });
    it("should have zero players", async () => {
        const { query, mutate } = createTestClient(PS.Server);
        const res = await mutate({
            mutation: DELETE_USER,
            variables: { authToken: savedAuthToken },
        });
        const getPlayers = await query({ query: GET_USER });
        expect(getPlayers.data.getPlayers.length).toBe(0);
    });

    it("should register one player and should be ready", async () => {
        const { query, mutate } = createTestClient(PS.Server);
        const res = await mutate({
            mutation: REGISTER_USER,
            variables: { data: { nickName: "itay" } },
        });

        if (res.data.registerPlayer) {
            savedAuthToken = res.data.registerPlayer.authToken;
        }

        const update = await mutate({
            mutation: UPDATE_USER,
            variables: { data: { ready: true, authToken: savedAuthToken } },
        });

        expect(update.data.updatePlayer.ready).toBeTruthy();
    });

    it("should receive player update status from subscription", async () => {
        const { mutate } = createTestClient(PS.Server);
        const shouldBeReady = (ready: boolean) => {
            expect(ready).toBeTruthy();
        };
        PS.playersPubSub.subscribe(
            PlayerEvents.PlayerUpdated,
            async (data: {
                playerUpdated: {
                    nickName: string;
                    authToken: string;
                    ready: boolean;
                };
            }) => {
                shouldBeReady(data.playerUpdated.ready);
            }
        );

        const update = await mutate({
            mutation: UPDATE_USER,
            variables: { data: { ready: true, authToken: savedAuthToken } },
        });
    });

    afterAll(async () => {
        return await PS.stop();
    });
});
