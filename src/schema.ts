const { gql } = require('apollo-server-express');

const typeDefs = gql`

input  PlayerInput {
    playerId: ID!
}
type Player {
    playerId: ID!
    name: String!
}

type Character {
    characterId: String!
    name: String!
    ownerID: Player!
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
    items: [Item]
}

type Item {
    itemId: ID!
    name: String!
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
}
type Mutation {

    addCharacter(
        name: String!,
        ownerId: PlayerInput!,
        strength: Int!,
        dexterity: Int!,
        constitution: Int!,
        intelligence: Int!,
        wisdom: Int!,
        charisma: Int!,
    ) : Character

    changeCharacter(
        characterId: ID!,
        name: String,
        ownerId: PlayerInput,
        strength: Int,
        dexterity: Int,
        constitution: Int,
        intelligence: Int,
        wisdom: Int,
        charisma: Int,
    ) : Character

    addPlayer(
        name: String!
    ) : Player

    changePlayer(
        name: String!
    ) : Player

    deletePlayer(
        playerId: ID!
    ) : String
}
type Query {
    getPlayer(
       playerId: ID!
    ) : Player

    getCharacter(
        characterId: ID!
    ) : Character

    listCharactersOwnedByPlayer(
        playerId: ID!
    ) : Character
}

interface MutationResponse {

  code: String!

  success: Boolean!

  message: String!

}
`;
module.exports = typeDefs;