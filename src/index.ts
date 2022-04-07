import fs from 'fs';
import path from 'path';
import readline from 'readline';
import Player from './PlayerMenu';
import Character from './CharacterMenu';
//Player login/start
//const character = require('./CharacterMenu.ts');
const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//test

let LoadedPlayerID;
// Commander variables
const com_string_PlayerLogIn = "INPUT PLAYER ID TO BEGIN: ";
let com_bool_PlayerLoadedState = false;
let com_bool_PlayerLoadedID : string;
const com_string_PlayerCharMenu = "AVAILABLE COMMANDS: NEW, LOAD (CHAR ID), DELETE (CHAR ID):";
let com_bool_CharacterLoadedState = false;
const com_string_CharacterMenu = "AVAILABLE COMMANDS: ROLLALL, REROLL (STAT), ADDITEM (ITEM), REMOVEITEM (ITEM)";
//
inquirer.on("close", function() {
    process.exit(0);
  });
//Start

function commanderStart() : void {
    inquirer.question(`${com_string_PlayerLogIn}`, playerInput => {
      Player.loadPlayer(playerInputCleanUp(playerInput));
      playerMenu();
    });
};
commanderStart();

function playerMenu() : void {
  inquirer.question(`${com_string_PlayerCharMenu}`, playerInput => {
    let Input = playerInput.split(" ");
    if (`${playerInputCleanUp(Input [0])}` == 'new'){
      let test = Input.slice(1).join(" ");
      //console.log(`sending name ${test}`);
      console.log(Player.listCharacters());
      let characterdata = Character.createCharacter(test);
      //Player.addCharacter(characterdata);
      console.log(characterdata);
      console.log(Player.listCharacters());
    } else {
      console.log("invalid command try again");
      playerMenu();
    }
  });

};



function playerInputCleanUp(Input) {
  //clean input of special characters
  Input.toLowerCase();
  return Input;
};

