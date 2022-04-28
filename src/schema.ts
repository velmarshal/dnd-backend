import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    enum Die {
        D4
        D6
        D8
        D10
        D12
        D20
        D100
    }

    input ChangePlayerInput {
        name: String
        characters: [ID]
    }
    input ChangeCharacterInput {
        name: String
        strength: Int
        dexterity: Int
        constitution: Int
        intelligence: Int
        wisdom: Int
        charisma: Int
        items: [ID]
    }
    input ChangeItemInput {
        name: String
        strength: Int
        dexterity: Int
        constitution: Int
        intelligence: Int
        wisdom: Int
        charisma: Int
    }
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
        roll(die: Die): Int!
        drop(itemID: ID!): DeletionResponse!
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

    type Mutation {
        createCharacter(playerID: ID!, name: String!): CreateCharacterResponse!
        createPlayer(name: String!): CreatePlayerResponse!
        createItem(name: String!): CreateItemResponse!
        deletePlayer(playerID: ID!): DeletionResponse!
        deleteCharacter(characterID: ID!): DeletionResponse!
        deleteItem(itemID: ID!): DeletionResponse!
        changePlayer(playerID: ID!, playerData: ChangePlayerInput): PlayerAlterationResponse!
        changeCharacter(characterID: ID!, characterData: ChangeCharacterInput): CharacterAlterationResponse!
        changeItem(itemID: ID!, itemData: ChangeItemInput): ItemAlterationResponse!
    }
    # FchangeCharacter(
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
    #
    #FdeleteCharacter
    #FdeleteItem

    # FchangePlayer(
    #     name: String!
    # ) : Player

    # FdeletePlayer(
    #     playerId: ID!
    # ) : String

    type Query {
        getPlayer(playerID: ID!): Player
        getCharacter(characterID: ID!): Character
        getItem(itemID: ID!): Item
    }

    interface MutationResponse {
        code: String
        success: Boolean!
        message: String
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
    type CreateItemResponse implements MutationResponse {
        code: String
        success: Boolean!
        message: String
        item: Item
    }
    type DeletionResponse implements MutationResponse {
        code: String
        success: Boolean!
        message: String
    }

    type PlayerAlterationResponse implements MutationResponse {
        code: String
        success: Boolean!
        message: String
        player: Player
    }
    type CharacterAlterationResponse implements MutationResponse {
        code: String
        success: Boolean!
        message: String
        character: Character
    }
    type ItemAlterationResponse implements MutationResponse {
        code: String
        success: Boolean!
        message: String
        item: Item
    }
`;
