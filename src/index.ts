import readline from 'readline';
import express from 'express';
import Player from './player';
import Character from './character';
import Item from './item';
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import http from 'http';
/*
prebaci da se poziva na id a ne name
middleware
apollo graphql
*/
//mongo
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://Velmarshal:pepsi@cluster0.xjn0f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
const charactersCollection = "charactersTest";
const playersCollection = "playersTest";
const itemsCollection = "itemsTest";
const databaseName = "velmarshal";
client.connect();

//expressa
const app = express();
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.listen(port, () => {})
const schema = require('./schema');

// Resolvers for graphql
const resolvers = {
    Query: {
      async getPlayer (_, { playerId }) {
        return client.db(databaseName).collection(playersCollection).findOne({"_id" : playerId});
      },
      async getCharacter (_, { characterId }) {
        return client.db(databaseName).collection(charactersCollection).findOne({"_id" : characterId});
      },
      async listCharactersOwnedByPlayer (_, { playerId }) {
        return client.db(databaseName).collection(charactersCollection).find({"ownerID" : playerId});
      },

    Mutation: {
      async addCharacter (_, { characterObject }) {
        try {
          const result = await createObject(charactersCollection, characterObject);
          return {
            code: 200,
            success: true,
            message: "Successfully added character.",
            character: result
          };
        }
        catch {
          return {
            code: 400,
            success: false,
            message: "Failed adding the character",
          };
        };
      },
      async addPlayer (_, { playerObject }) {
        try {
          const result = createObject(playersCollection, playerObject);
          return {
            code: 200,
            success: true,
            message: "Successfully added player.",
            player: result
          };
        }
        catch {
          return {
            code: 400,
            success: false,
            message: "Failed adding the player.",
          };
        };
      },
      async changePlayer (_, { playerObject }) {
        try {
          client.db(databaseName).collection(playersCollection).updateOne({"_id" : playerObject._id},{$set: playerObject});
          return {
            code: 200,
            success: true,
            message: "Successfully altered player."
          };
        }
        catch {
          return {
            code: 400,
            success: false,
            message: "Failed altering the player.",
          };
        };
      },
      async changeCharacter (_, { characterObject }) {
        try {
          client.db(databaseName).collection(playersCollection).updateOne({"_id" : characterObject._id},{$set: characterObject});
          return {
            code: 200,
            success: true,
            message: "Successfully altered character."
          };
        }
        catch {
          return {
            code: 400,
            success: false,
            message: "Failed altering the character.",
          };
        };
      },
      async deletePlayer (_, { playerId }) {
        try {
          client.db(databaseName).collection(playersCollection).deleteOne({"_id" : playerId});
          client.db(databaseName).collection(charactersCollection).delete({"ownerID" : playerId});
          return {
            code: 200,
            success: true,
            message: "Successfully deleted the player and their characters."
          };
        }
        catch {
          return {
            code: 400,
            success: false,
            message: "Failed deleting the player.",
          };
        };
      },
    }
    },
  };
//


async function startApolloServer(typeDefs, resolvers) {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  console.log("server starting");
  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: port }));

  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
}
startApolloServer(schema, resolvers);
//

  // Player reqs
  app.get('/player', async (req, res) => {
    const playerList = await listPlayers();
    res.send(playerList);
   return;
  })

  app.get('/player/:id', async (req, res)  => {
    res.send(await loadObject(playersCollection,req.params.id));
    return;
  });

  app.post('/player', async (req, res) =>{
    const newPlayer : Player = req.body;
    await createObject(playersCollection, newPlayer);
    res.send("created new player " + newPlayer.name);
    return;
  })
  app.patch('/player/:id', async (req, res) =>{
    let playerObject : Player = req.body;
    console.log(playerObject);
    await updatePlayerName(playersCollection, playerObject, req.params['id']);
    res.send(`player updated`);
    return;
  });
  app.delete('/player/:id',(req, res) =>{
    deleteObject(playersCollection,req.params.id);
    res.send(`deleted player ${req.params.id}`);
    return;
  })
  // Character reqs
  app.get('/player/:id/character', async (req, res) => {
    let result = await listCharacters(req.params['id']);
    res.send(result);
    return result;
   })
  app.get('/player/:playerId/character/:charId', async (req, res) => {
    res.send(await loadObject(charactersCollection, req.params.charId));
    return;
  })
  app.post('/player/:id/character', async (req, res) => {
    let newCharacter : Character = req.body;
    newCharacter.ownerID = req.params['id'];
    await createObject(charactersCollection, newCharacter);
    res.send("created new character: " + newCharacter.name);
    return;
  })
  app.patch('/player/:playerId/character/:charId', (req, res) => {
    let characterObject : Character = req.body;
    characterObject.name = req.params['charId'];
    updateObject(charactersCollection,characterObject);
    res.send(`character updated`);
    return;
  })


//Player login/start
let playerVarID;
let loadedCharacter : Character;
const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
inquirer.on("close", function() {
    process.exit(0);
  });

function exit() : void {
    inquirer.close();
  };
inquirer.question('player id: ', (playerInput) => {
   start(playerInput);
});

async function start(input) {
  if (input){
    if (await checkObject(playersCollection, input)===true){
        console.log(`Player with ID ${input} found. LOADING...`)
        playerVarID = input;
        console.log("loading player menu")
        playerMenu();
        return;
    } else {
        console.log(`Player with ID ${input} not found. CREATING NEW PROFILE...`)
        playerVarID = input;
        let playerObject = new Player(input);
        createObject(playersCollection, playerObject);
        playerMenu();
        return;
    }
  }
}

//console commands
function playerMenu () : void {
  inquirer.question(`Available commands: NEW, LOAD(ID), DELETE(ID), LIST, SAVE: `, async (input : string) => {
    let playerInput = input.toLowerCase().split(" ");
    switch(playerInput[0]){
      case "new":
        if (playerInput.length >1){
          if (await checkObject(charactersCollection, playerInput [1])===false){
            loadedCharacter = new Character(playerInput[1], playerVarID);
            createObject (charactersCollection, loadedCharacter);
            characterMenu(loadedCharacter);
          } else {
            console.log("CHARACTER EXISTS, USE LOAD COMMAND");
          }
        } else {
          console.log("CHARACTER NAME REQUIRED");
        }

      break;
      //
      case "load":
        if (playerInput.length >1){
          if (await checkObject(charactersCollection, playerInput [1])===true){
            let file = await loadObject(charactersCollection, playerInput[1]);
            loadedCharacter = new Character(playerInput[1], playerVarID);
            loadedCharacter.loadCharacterFromJSON(file);
            characterMenu(loadedCharacter);
          } else {
            console.log("CHARACTER DOES NOT EXIST, USE NEW COMMAND");
          }
        } else {
          console.log("CHARACTER NAME REQUIRED");
        }
      break;
      //
      case "delete":
        if (playerInput.length >1){
          if (await checkObject(charactersCollection, playerInput [1])===true){
            await deleteObject(charactersCollection, playerInput[1]);
            console.log(`CHARACTER ${playerInput[1]} DELETED`);
          } else {
            console.log("CHARACTER DOES NOT EXIST");
          }
        } else {
          console.log("CHARACTER NAME REQUIRED");
      }
      break;
      //
      case "list":
        console.log(await listCharacters(playerVarID));
      break;
      //
      case "save":
        saveObject(charactersCollection, loadedCharacter);
        console.log(`Player ${playerVarID} has been saved`);
        playerMenu();
      break;
      //
      case "exit":
        client.close;
        exit();
      break;
      //
      default:
        console.log("INVALID COMMAND");
      break;
    } 
    playerMenu();


  })
};

function characterMenu (objectLoadedCharacter){
  inquirer.question('Available commands: REROLL, ADDITEM (NAME STAT QT), REMOVEITEM (NAME), LIST, EXIT: ', async (input : string) => {
  let playerInput = input.toLowerCase().split(" ");
    switch(playerInput[0]){
      case "reroll":{
        if(loadedCharacter.itemIDs.length > 0){
          let itemStatMods : number[] = [0, 0, 0, 0, 0, 0];
          let loadedItem : Item;
          for (let i = 0; i < loadedCharacter.itemIDs.length; i++){
            loadedItem = await loadObject(itemsCollection, loadedCharacter.itemIDs[i]);
            itemStatMods[0] += loadedItem.strength;
            itemStatMods[1] += loadedItem.dexterity;
            itemStatMods[2] += loadedItem.constitution;
            itemStatMods[3] += loadedItem.intelligence;
            itemStatMods[4] += loadedItem.wisdom;
            itemStatMods[5] += loadedItem.charisma;
          }
          loadedCharacter.rerollStats(itemStatMods[0],itemStatMods[1],itemStatMods[2],itemStatMods[3],itemStatMods[4],itemStatMods[5]);
        } else{
          loadedCharacter.rerollStats(0 , 0 , 0 , 0 , 0 , 0);
        }
        
      }
      break;
      //
      case "additem":
        let doesItemExist : boolean = await checkObject(itemsCollection, playerInput[1]);
        let newItem : Item;
        if (doesItemExist === true){
          let itemToLoad : Item = await loadObject(itemsCollection, playerInput[1]);
          newItem = loadedCharacter.addItem(true, playerInput[1],playerInput[2],playerInput[3], itemToLoad);
        } else {
          newItem = loadedCharacter.addItem(false, playerInput[1],playerInput[2],playerInput[3]);
          createObject(itemsCollection, newItem);
        }
        
      break;
      //
      case "removeitem":
        if (playerInput.length >1){
          let itemToDeleteObject = await loadObject(itemsCollection, playerInput[1]);
          loadedCharacter.deleteItem(itemToDeleteObject);
          
        } else {
          console.log("ITEM NAME REQUIRED");
        }
      break;
      //
      case "list":
        console.log(loadedCharacter);
        console.log(loadedCharacter.listItems());
      break;
      //
      case "exit":
        playerMenu();
      break;
      case "save":
        saveObject(charactersCollection, loadedCharacter)
      break;
      default:
        console.log("INVALID COMMAND");
      break;
    }
    characterMenu(objectLoadedCharacter);
  })
};

//async functions
async function createObject(collection, object){

  const result = await client.db(databaseName).collection(collection).insertOne(object);
  return result;
  //console.log(`New object created with the following id: ${result.insertedId} in ${collection} collection`);

}

async function checkObject(collection, name){

  const result = await client.db(databaseName).collection(collection).countDocuments({"name" : name}, { limit: 1 });
  if (result < 1){
    //console.log(`Object with id not found`);
    let returnBool = false;
    return returnBool;
  } else {
    //console.log(`Object with id found: ${name} in ${collection} collection`);
    let returnBool = true;
    return returnBool;
  }
};

async function checkObjectById(collection, id){

  const result = await client.db(databaseName).collection(collection).countDocuments({"_id" : id}, { limit: 1 });
  if (result < 1){
    let returnBool = false;
    return returnBool;
  } else {
    let returnBool = true;
    return returnBool;
  }
};

async function listCharacters(playerID){
  const resultL = await client.db(databaseName).collection(charactersCollection).find({"ownerID" : playerID}).toArray()
  let resultLOut = [];
  function separateNames(item){
    resultLOut.push(item.name);
  };
  resultL.forEach(separateNames);

  return resultLOut;
};
async function loadObject(collection, name){

  const result = await client.db(databaseName).collection(collection).findOne({"name" : name});
  //console.log(result);
  return result;

};
async function saveObject(collection, object : Character){
  //console.log(object);
  const result = await client.db(databaseName).collection(collection).updateOne({"name" : object.name}, object);
};
async function listPlayers(){
  const resultL = await client.db(databaseName).collection(playersCollection).find().toArray()
  let resultLOut = [];
  function separateNames(item){
    resultLOut.push(item.name);
  };
  resultL.forEach(separateNames);
  //console.log(`logged player list ${resultL}`);
  return resultLOut;
};
async function deleteObject(collection, name) {
  const result = await client.db(databaseName).collection(collection).deleteOne({"name" : name});
  console.log(`${name} has been deleted from ${collection}`);
  return ("object has been deleted");
}

async function updateObject(collection, object){
  const result = await client.db(databaseName).collection(collection).updateOne({"name" : object.name},{$set: object});
  return ("object has been updated");
};
async function updatePlayerName(collection, object, playerNameToUpdate : string){
  const result = await client.db(databaseName).collection(collection).updateOne({"name" : playerNameToUpdate},{$set: object});
  return ("object has been updated");
};
