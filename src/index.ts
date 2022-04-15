//import fs from 'fs';
//import path from 'path';
import readline from 'readline';
import Player from './player';
import Character from './character';
//mongo
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://Velmarshal:pepsi@cluster0.xjn0f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
const charactersCollection = "charactersTest";
const playersCollection = "playersTest";
const itemssCollection = "itemsTest";
const databaseName = "velmarshal";
client.connect();
//createObject (client, playersCollection, "Prcko")

//Player login/start
let player;
const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let loadedCharacter : Character;


inquirer.on("close", function() {
    process.exit(0);
  });


function exit() : void {
    inquirer.close();
  };

  //console commands
  
 inquirer.question('player id: ', async (input) => {
    if (await checkObject(playersCollection, input)===true){
      console.log(`Player with ID ${input} found. LOADING...`)
      player = input;
    } else {
      console.log(`Player with ID ${input} not found. CREATING NEW PROFILE...`)
      player = input;
      let playerObject = new Player(input);
      createObject(playersCollection, playerObject);
    }

    
    playerMenu();
  })
  

function playerMenu () : void {
  inquirer.question(`Available commands: NEW, LOAD(ID), DELETE(ID), LIST, SAVE: `, async (input : string) => {
    let playerInput = input.toLowerCase().split(" ");
    switch(playerInput[0]){
      case "new":
        if (playerInput.length >1){
          if (await checkObject(charactersCollection, playerInput [1])===false){
            loadedCharacter = new Character(playerInput[1], player);
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
            loadedCharacter = new Character(playerInput[1], player);
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
          if (await checkObject(charactersCollection, input)===true){
            player.deleteCharacter(playerInput[1]);
          } else {
            console.log("CHARACTER DOES NOT EXIST");
          }
        } else {
          console.log("CHARACTER NAME REQUIRED");
      }
      break;
      //
      case "list":
        listCharacters(player);
      break;
      //
      case "save":
        saveObject(charactersCollection, loadedCharacter);
        console.log(`Player ${player} has been saved`);
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
  inquirer.question('Available commands: REROLL, ADDITEM (NAME STAT QT), REMOVEITEM (NAME), LIST, EXIT: ', (input : string) => {
  let playerInput = input.toLowerCase().split(" ");
    switch(playerInput[0]){
      case "reroll":
        loadedCharacter.rerollStats();
      break;
      //
      case "additem":
      //let newItem = loadedCharacter.addItem(playerInput[1],playerInput[2],playerInput[3]);
      //createObject(itemssCollection, newItem);
      break;
      //
      case "removeitem":
        if (playerInput.length >1){
          loadedCharacter.deleteItem(playerInput[1]);
          
        } else {
          console.log("ITEM NAME REQUIRED");
        }
      break;
      //
      case "list":
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

  console.log(`New object created with the following id: ${result.insertedId} in ${collection} collection`);

}

async function checkObject(collection, name){

  const result = await client.db(databaseName).collection(collection).countDocuments({"name" : name}, { limit: 1 });
  if (result < 1){
    console.log(`Object with id not found`);
    let returnBool = false;
    return returnBool;
  } else {
    console.log(`Object with id found: ${name} in ${collection} collection`);
    let returnBool = true;
    return returnBool;
  }

};
async function listCharacters(playerID){
  const result = await client.db(databaseName).collection(charactersCollection).find({"ownerID" : playerID}).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
    })
};
async function loadObject(collection, name){

  const result = await client.db(databaseName).collection(collection).findOne({"name" : name});
  return result;

};
async function saveObject(collection, object : Character){

  await client.db(databaseName).collection(collection).findOneAndReplace({"name" : object.name},{object});

};



