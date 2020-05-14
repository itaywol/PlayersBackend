import { v1 as uuidv1 } from "uuid";
import { PubSub } from "apollo-server";

export interface IPlayer {
    nickName: string;
    authToken: string;
    ready: Boolean;
}

export interface ICreatePlayer {
    nickName: string;
}

export enum PlayerEvents {
    PlayerUpdated = "PLAYER_UPDATED",
}

export interface findOneResult {
    player: IPlayer | null;
    index: number | null;
}

export class PlayersDatabase {
    private Players: IPlayer[];
    private playersPubSub: PubSub;

    constructor(PubSub: PubSub) {
        this.Players = [];
        this.playersPubSub = PubSub;
    }

    createNewPlayer(data: ICreatePlayer): IPlayer {
        return { nickName: data.nickName, authToken: uuidv1(), ready: false };
    }

    findOneByAuthToken(authToken: string): findOneResult {
        const playerIndex = this.Players.findIndex(
            (player: IPlayer) => player.authToken === authToken
        );

        if (playerIndex === -1) return { player: null, index: null };

        return { player: this.Players[playerIndex], index: playerIndex };
    }

    findOneByNickname(nickName: string): findOneResult {
        const playerIndex = this.Players.findIndex(
            (player: IPlayer) => player.nickName === nickName
        );

        if (playerIndex === -1) return { player: null, index: null };

        return { player: this.Players[playerIndex], index: playerIndex };
    }

    registerPlayer(data: ICreatePlayer): IPlayer {
        if (this.findOneByNickname(data.nickName).index !== null)
            throw new Error("User with that nickname already exists");

        // Create new player object
        const player: IPlayer = this.createNewPlayer(data);

        // push to the array of players
        this.Players.push(player);

        // return the new player
        return this.Players[this.Players.length - 1];
    }

    getPlayers(): IPlayer[] {
        return this.Players;
    }

    updatePlayer(authToken: string, ready: Boolean): IPlayer {
        // Find player item index
        const playerIndex: number = this.findOneByAuthToken(authToken).index;

        if (playerIndex === null)
            throw new Error("Cannot update non existing player");

        // set Ready
        this.Players[playerIndex].ready = ready;

        // update the other players using pubsub
        this.playersPubSub.publish(PlayerEvents.PlayerUpdated, {
            playerUpdated: this.Players[playerIndex],
        });

        // return the modified player
        return this.Players[playerIndex];
    }

    deletePlayer(authToken: string): Boolean {
        // Find player item index
        const playerIndex = this.findOneByAuthToken(authToken).index;

        if (playerIndex === null)
            throw new Error("Cannot delete non existing player");

        // remove the player
        this.Players.splice(playerIndex, 1);

        return true;
    }
}
