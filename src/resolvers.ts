import { Db, ObjectId } from 'mongodb';

const charactersCollection = "charactersTest";
const playersCollection = "playersTest";
const itemsCollection = "itemsTest";

type Context = { db: Db }
const createMongoID = () => {
    const mongoID = new ObjectId();
    return {
        _id: mongoID,
        id: mongoID
    };
}

const getMongoID = (str) => new ObjectId(str);

const rollStat = () => {
    let roll: number;
    let rollResults: number[] = [];

    for (let i = 0; i < 4; i++) {
        roll = Math.ceil(Math.random() * 5) + 1;
        rollResults.push(roll);
    };

    rollResults = rollResults.sort().reverse();
    return rollResults[0] + rollResults[1] + rollResults[2];
};

const rollStats = () => ({
    strength: rollStat(),
    dexterity: rollStat(),
    constitution: rollStat(),
    intelligence: rollStat(),
    wisdom: rollStat(),
    charisma: rollStat(),
});
/*
Queries     - done
Mutations   -
NEW         - done
EDIT        -
DELETE      -
*/
function updateValues (oldVal, newVal) {
    if (newVal !== undefined && newVal !== null) {
        return newVal;
    } else {
        return oldVal;
    }
};


export const resolvers = {
    //Queries
    Query: {
        getPlayer: async (_, args, context: Context) => {
            return context.db.collection(playersCollection).findOne({ _id: getMongoID(args.playerID) });

        },
        getCharacter: async (_, args, context: Context) => {
            return context.db.collection(charactersCollection).findOne({ _id: getMongoID(args.characterID) });
        },
        getItem: async (_, args, context: Context) => {
            return context.db.collection(itemsCollection).findOne({ _id: getMongoID(args.itemID) });
        },
    },
    //Mutations
    Mutation: {
        createPlayer: async (_, args, context: Context) => {
            const playerResult = await context.db.collection(playersCollection).insertOne({
                ...createMongoID(),
                characters: [],
                name: args.name
            });

            if (!playerResult.insertedId) {6
                return {
                    code: 400,
                    success: false,
                    message: 'Something went wrong',
                    player: null
                };
            }

            const player = await context.db.collection(playersCollection).findOne({ _id: getMongoID(playerResult.insertedId) });

            return {
                code: 200,
                success: true,
                message: null,
                player: player
            };
        },
        createCharacter: async (_, args, context: Context) => {
            const player = await context.db.collection(playersCollection).findOne({ _id: getMongoID(args.playerID) });

            if (!player) {
                return {
                    code: 400,
                    success: false,
                    message: 'Something went wrong',
                    character: null
                };
            }

            const characterResult = await context.db.collection(charactersCollection).insertOne({
                ...createMongoID(),
                ...rollStats(),
                items: [],
                name: args.name
            });

            if (!characterResult.insertedId) {
                return {
                    code: 400,
                    success: false,
                    message: 'Something went wrong',
                    player: null
                };
            }

            const character = await context.db.collection(charactersCollection).findOne({ _id: characterResult.insertedId });
            player.characters.push(characterResult.insertedId);
            await context.db.collection(playersCollection).updateOne({ _id: getMongoID(player._id) }, { $set: player });
            return {
                code: 200,
                success: true,
                message: null,
                character
            };
        },
        createItem: async (_, args, context: Context) => {
            const itemResult = await context.db.collection(itemsCollection).insertOne({
                ...createMongoID(),
                name: args.name,
                strength: args.strength,
                dexterity: args.dexterity,
                constitution: args.constitution,
                intelligence: args.intelligence,
                wisdom: args.wisdom,
                charisma: args.charisma
            });

            if (!itemResult.insertedId) {
                return {
                    code: 400,
                    success: false,
                    message: 'Something went wrong',
                    item: null
                };
            }

            const item = await context.db.collection(itemsCollection).findOne({ _id: itemResult.insertedId });

            return {
                code: 200,
                success: true,
                message: null,
                item: item
            };
        },
        deletePlayer: async (_, args, context: Context) => {
            if (await context.db.collection(playersCollection).countDocuments({ _id: getMongoID(args.playerID) }, { limit: 1 })) {
                const tempPlayer = await context.db.collection(playersCollection).findOne({ _id: getMongoID(args.playerID) });
                for (const charID of tempPlayer.characters) {
                    await context.db.collection(charactersCollection).deleteOne({ _id: getMongoID(charID) });
                }
                await context.db.collection(playersCollection).deleteOne({ _id: getMongoID(args.playerID) });
                return {
                    code: 200,
                    success: true,
                    message: "succesful deletion",
                };
            } else {
                return {
                    code: 400,
                    success: false,
                    message: "failed deletion",
                };
            }
        },
        deleteCharacter: async (_, args, context: Context) => {
            if (await context.db.collection(charactersCollection).countDocuments({ _id: getMongoID(args.characterID) }, { limit: 1 }) >0 ) {
                await context.db.collection(playersCollection).updateOne({ characters: [getMongoID(args.characterID)]}, {$pull: {characters: getMongoID(args.characterID)}});
                return {
                    code: 200,
                    success: true,
                    message: "succesful deletion",
                };
            } else {
                return {
                    code: 400,
                    success: false,
                    message: "failed deletion",
                };
            }
        },
        /*
        deleteItem: async (_, args, context: Context) => {
            if (await context.db.collection(itemsCollection).countDocuments({ _id: getMongoID(args.itemID) }, { limit: 1 }) >0 ) {
                await context.db.collection(charactersCollection).update({ items: [getMongoID(args.itemID)]}, {$pull: {items: getMongoID(args.itemID)}}, {upsert: false},{multi: true});
                return {
                    code: 200,
                    success: true,
                    message: "succesful deletion",
                };
            } else {
                return {
                    code: 400,
                    success: false,
                    message: "failed deletion",
                };
            }

        },
        */
        changePlayer: async (_, args, context: Context) => {
            if (await context.db.collection(playersCollection).countDocuments({ _id: getMongoID(args.playerID) }, { limit: 1 })) {
                let tempPlayer = await context.db.collection(playersCollection).findOne({ _id: getMongoID(args.playerID)});
                tempPlayer.name         = updateValues(tempPlayer.name , args.playerData.name);
                tempPlayer.characters   = updateValues(tempPlayer.characters , args.playerData.characters);
                await context.db.collection(playersCollection).updateOne({ _id: getMongoID(args.playerID)}, {$set: tempPlayer});
                return {
                    code: 200,
                    success: true,
                    message: "succesfully changed the player",
                    player: tempPlayer
                };
            } else {
                return {
                    code: 400,
                    success: false,
                    message: "couldnt find the player",
                    player: null
                };
            }
        },
        changeCharacter: async (_, args, context: Context) => {
            if (await context.db.collection(charactersCollection).countDocuments({ _id: getMongoID(args.characterID) }, { limit: 1 })) {
                let tempCharacter = await context.db.collection(charactersCollection).findOne({ _id: getMongoID(args.characterID)});
                tempCharacter.name          = updateValues(tempCharacter.name, args.characterData.name);
                tempCharacter.strength      = updateValues(tempCharacter.strength, args.characterData.strength);
                tempCharacter.dexterity     = updateValues(tempCharacter.dexterity, args.characterData.dexterity);
                tempCharacter.constitution  = updateValues(tempCharacter.constitution, args.characterData.constitution);
                tempCharacter.intelligence  = updateValues(tempCharacter.intelligence, args.characterData.intelligence);
                tempCharacter.wisdom        = updateValues(tempCharacter.wisdom, args.characterData.wisdom);
                tempCharacter.charisma      = updateValues(tempCharacter.charisma, args.characterData.charisma);
                tempCharacter.items         = updateValues(tempCharacter.items, args.characterData.items);
                await context.db.collection(charactersCollection).updateOne({ _id: getMongoID(args.characterID)}, {$set: tempCharacter});
                return {
                    code: 200,
                    success: true,
                    message: "succesfully changed the character",
                    character: tempCharacter
                };
            } else {
                return {
                    code: 400,
                    success: false,
                    message: "couldnt find the character",
                    character: null
                };
            }
        },
        changeItem: async (_, args, context: Context) => {
            if (await context.db.collection(itemsCollection).countDocuments({ _id: getMongoID(args.itemID) }, { limit: 1 })) {
                let tempItem = await context.db.collection(itemsCollection).findOne({ _id: getMongoID(args.itemID)});
                tempItem.name           = updateValues(tempItem.name, args.itemData.name);
                tempItem.strength       = updateValues(tempItem.strength, args.itemData.strength);
                tempItem.dexterity      = updateValues(tempItem.dexterity, args.itemData.dexterity);
                tempItem.constitution   = updateValues(tempItem.constitution, args.itemData.constitution);
                tempItem.intelligence   = updateValues(tempItem.intelligence, args.itemData.intelligence);
                tempItem.wisdom         = updateValues(tempItem.wisdom, args.itemData.wisdom);
                tempItem.charisma       = updateValues(tempItem.charisma, args.itemData.charisma);
                await context.db.collection(itemsCollection).updateOne({ _id: getMongoID(args.itemID)}, {$set: tempItem});
                return {
                    code: 200,
                    success: true,
                    message: "succesfully changed the item",
                    item: tempItem
                };
            } else {
                return {
                    code: 400,
                    success: false,
                    message: "couldnt find the item",
                    item: null
                };
            }
        }

    },

    Player: {
        characters: async (parent, _, context: Context) => {
            const characters = [];

            for (const characterID of parent.characters) {
                characters.push(await context.db.collection(charactersCollection).findOne({ _id: getMongoID(characterID) }));
            }

            return characters;
        }
    },
    
    Character: {
        strength: async(parent, _, context: Context) => {
            let charStat = parent.strength;
            console.log(parent.strength);
            for (const itemID of parent.items) {
                let tempitem = await context.db.collection(itemsCollection).findOne({ _id: getMongoID(itemID) })
                console.log(itemID);
                if (tempitem.strength){
                    charStat += tempitem.strength;
                }
            }
            console.log(charStat);
            return charStat;
        },
        dexterity: async(parent, _, context: Context) => {
            let charStat = parent.dexterity;
            for (const itemID of parent.items) {
                let tempitem = await context.db.collection(itemsCollection).findOne({ _id: getMongoID(itemID) })
                if (tempitem.dexterity){
                    charStat += tempitem.dexterity;
                }
            }
            return charStat;
        },
        constitution: async(parent, _, context: Context) => {
            let charStat = parent.constitution;
            for (const itemID of parent.items) {
                let tempitem = await context.db.collection(itemsCollection).findOne({ _id: getMongoID(itemID) })
                if (tempitem.constitution){
                    charStat += tempitem.constitution;
                }
            }
            return charStat;
        },
        intelligence: async(parent, _, context: Context) => {
            let charStat = parent.intelligence;
            for (const itemID of parent.items) {
                let tempitem = await context.db.collection(itemsCollection).findOne({ _id: getMongoID(itemID) })
                if (tempitem.intelligence){
                    charStat += tempitem.intelligence;
                }
            }
            return charStat;
        },
        wisdom: async(parent, _, context: Context) => {
            let charStat = parent.wisdom;
            for (const itemID of parent.items) {
                let tempitem = await context.db.collection(itemsCollection).findOne({ _id: getMongoID(itemID) })
                if (tempitem.wisdom){
                    charStat += tempitem.wisdom;
                }
            }
            return charStat;
        },
        charisma: async(parent, _, context: Context) => {
            let charStat = parent.charisma;
            for (const itemID of parent.items) {
                let tempitem = await context.db.collection(itemsCollection).findOne({ _id: getMongoID(itemID) })
                if (tempitem.charisma){
                    charStat += tempitem.charisma;
                }
            }
            return charStat;
        },
        items: async (parent, _, context: Context) => {
            const items = [];

            for (const itemID of parent.items) {
                items.push(await context.db.collection(itemsCollection).findOne({ _id: getMongoID(itemID) }));
            }

            return items;
        },

        // obtainItem: ()
        roll: (_, args, context: Context) => {
            let dieVar = args.die;
            let dieSides;
            if (dieVar === "D4") dieSides = 4;
            if (dieVar === "D6") dieSides = 6;
            if (dieVar === "D8") dieSides = 8;
            if (dieVar === "D10") dieSides = 10;
            if (dieVar === "D12") dieSides = 12;
            if (dieVar === "D20") dieSides = 20;
            if (dieVar === "D100") dieSides = 100;
            return Math.ceil(Math.random() * (dieSides-1)) + 1;
        }
    }
};