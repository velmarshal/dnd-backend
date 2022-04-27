import { gql } from 'apollo-server-express';

export const typeDefs = gql`

type Character {
    id: ID!
    name: String!
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
    items: [Item]
    roll: Int!
}

type Player {
    id: ID!
    name: String!
    characters: [Character]
}

type Item {
    id: ID!
    name: String!
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
}

type CreateCharacterResponse implements MutationResponse {
    code: String
    success: Boolean!
    message: String
    character: Character
}

type CreatePlayerResponse implements MutationResponse {
    code: String
    success: Boolean!
    message: String
    player: Player
}

type Mutation {
    createCharacter(playerID: ID!, name: String!) : CreateCharacterResponse!
    createPlayer(name: String!): CreatePlayerResponse!

    # changeCharacter(
    #     characterId: ID!,
    #     name: String,
    #     ownerId: PlayerInput,
    #     strength: Int,
    #     dexterity: Int,
    #     constitution: Int,
    #     intelligence: Int,
    #     wisdom: Int,
    #     charisma: Int,
    # ) : Character

    # changePlayer(
    #     name: String!
    # ) : Player

    # deletePlayer(
    #     playerId: ID!
    # ) : String
}

type Query {
    getPlayer(playerID: ID!): Player
    getCharacter(characterID: ID!): Character
}

interface MutationResponse {
  code: String
  success: Boolean!
  message: String
}
`;