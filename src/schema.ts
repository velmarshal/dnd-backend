const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Player {
    playerId: ID!
    name: String!
}

type Character {
    characterId: String!
    name: String!
    ownerID: Player!
    strength: Number!
    dexterity: Number!
    constitution: Number!
    intelligence: Number!
    wisdom: Number!
    charisma: Number!
    items: [Item]
}

type Item {
    itemId: ID!
    name: String!
    strength: Number
    dexterity: Number
    constitution: Number
    intelligence: Number
    wisdom: Number
    charisma: Number
}
type Mutation {

    addCharacter(
        name: String!,
        ownerId: Player!,
        strength: Number!,
        dexterity: Number!,
        constitution: Number!,
        intelligence: Number!,
        wisdom: Number!,
        charisma: Number!,
    ) : Character

    changeCharacter(
        characterId: ID!,
        name: String,
        ownerId: Player,
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number,
    ) : Character

    addPlayer(
        name: String!
    ) : Player

    changePlayer(
        name: String!
    ) : Player

    deletePlayer(
        playerId: ID!
    )
}
type Query {
    getPlayer(
       playerId: ID!
    )

    getCharacter(
        characterId: ID!
    )

    listCharactersOwnedByPlayer(
        playerId: ID!
    )
}

interface MutationResponse {

  code: String!

  success: Boolean!

  message: String!

}
`;
module.exports = typeDefs;