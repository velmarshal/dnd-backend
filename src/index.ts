import fs from 'fs';
import path from 'path';
import readline from 'readline';
import Player from './player';
import Character from './character';

//Player login/start
let player;
const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let loadedCharacterIndex : number;

inquirer.on("close", function() {
    process.exit(0);
  });


function exit() : void {
    inquirer.close();
  };

  //console commands
  inquirer.question('player id: ', (input) => {
    
    player = new Player(input);
    playerMenu();
  })

function playerMenu () : void {
  inquirer.question(`${player.id}Available commands: NEW, LOAD(ID), DELETE(ID), LIST, SAVE: `, (input : string) => {
    let playerInput = input.toLowerCase().split(" ");
    switch(playerInput[0]){
      case "new":
        if (playerInput.length >1){
          player.addCharacter(playerInput[1]);
        } else {
          console.log("CHARACTER NAME REQUIRED");
        }

      break;
      //
      case "load":
        if (playerInput.length >1){
          loadedCharacterIndex = player.loadCharacter(playerInput[1]);
          characterMenu(loadedCharacterIndex);
        } else {
          console.log("CHARACTER NAME REQUIRED");
        }
      break;
      //
      case "delete":
        if (playerInput.length >1){
        player.deleteCharacter(playerInput[1]);
      } else {
        console.log("CHARACTER NAME REQUIRED");
      }
      break;
      //
      case "list":
        console.log(player.getCharacters());
      break;
      //
      case "save":
        player.save();
        console.log(`Player ${player.id} has been saved`);
        playerMenu();
      break;
      //
      case "exit":
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

function characterMenu (indexOfLoadedCharacter){
  inquirer.question('Available commands: REROLL, ADDITEM (NAME STAT QT), REMOVEITEM (NAME), LIST, EXIT: ', (input : string) => {
  console.log(player.characters[indexOfLoadedCharacter]);
  let playerInput = input.toLowerCase().split(" ");
    switch(playerInput[0]){
      case "reroll":
        console.log(player.characters[indexOfLoadedCharacter]);
        player.characters[indexOfLoadedCharacter].rerollStats();
      break;
      //
      case "additem":
      player.characters[indexOfLoadedCharacter].addItem(playerInput[1],playerInput[2],playerInput[3])
      break;
      //
      case "removeitem":
        if (playerInput.length >1){
          player.characters[indexOfLoadedCharacter].deleteItem(playerInput[1]);
          
        } else {
          console.log("ITEM NAME REQUIRED");
        }
      break;
      //
      case "list":
        console.log(player.characters[indexOfLoadedCharacter].listItems());
      break;
      //
      case "exit":
        playerMenu();
      break;
      default:
        console.log("INVALID COMMAND");
      break;
    }
    characterMenu(loadedCharacterIndex);
  })
};






