import { Db, ObjectId } from 'mongodb';

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

export const resolvers = {
    Query: {
        getPlayer: async (_, args, context: Context) => {
            return context.db.collection('players').findOne({ _id: getMongoID(args.playerID) });
        }
    },
    Mutation: {
        createPlayer: async (_, args, context: Context) => {
            const playerResult = await context.db.collection('players').insertOne({
                ...createMongoID(),
                characters: [],
                name: args.name
            });

            if (!playerResult.insertedId) {
                return {
                    success: false,
                    message: 'Something went wrong',
                    player: null
                };
            }

            const player = await context.db.collection('players').findOne({ _id: playerResult.insertedId });

            return {
                success: true,
                message: null,
                player: player
            };
        },

        createCharacter: async (_, args, context: Context) => {
            const player = await context.db.collection('players').findOne({ _id: getMongoID(args.playerID) });

            if (!player) {
                return {
                    success: false,
                    message: 'Something went wrong',
                    character: null
                };
            }

            const characterResult = await context.db.collection('characters').insertOne({
                ...createMongoID(),
                ...rollStats(),
                items: [],
                name: args.name
            });

            if (!characterResult.insertedId) {
                return {
                    success: false,
                    message: 'Something went wrong',
                    player: null
                };
            }

            const character = await context.db.collection('characters').findOne({ _id: characterResult.insertedId });
            player.characters.push(characterResult.insertedId);
            await context.db.collection('players').updateOne({ _id: player._id }, { $set: player });
            return {
                code: 200,
                success: true,
                message: null,
                character
            };
        },
    },

    Player: {
        characters: async (parent, _, context: Context) => {
            const characters = [];

            for (const characterID of parent.characters) {
                characters.push(await context.db.collection('characters').findOne({ _id: characterID }));
            }

            return characters;
        }
    },
    
    Character: {
        items: async (parent, _, context: Context) => {
            const items = [];

            for (const itemID of parent.items) {
                items.push(await context.db.collection('items').findOne({ _id: itemID }));
            }

            return items;
        },

        // obtainItem: ()
        roll: () => {
            return Math.ceil(Math.random() * 19) + 1;
        }
    }
};