# Goal

Create a backend of a game, players can register to your game with unique nickname and join a lobby of players.
Each player can update his own state to ready once in the players lobby, and all of the other players should get his new status on change.


# Using the following libraries/frameworks/markup:

- Typescript
- RxJS
- Apollo-Server & Express
- PubSub (Apollo Subscriptions)


# Queries/Mutations/Subscriptions:

1. Query: get all players
2. Mutation: Register new player
3. Mutation: Update Player State
4. Subscription: Player State Changed

## Side Goals

1. Write tests

## How to run:

Method 1 (Dockerz):
```
cp .env.example .env
docker-compose up -d
```

Method 2 (Node and Development mode):

```
source .env.example
npm run start:dev
```
