import express, {Request, Response} from 'express';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import util from 'util';
//import EventEmitter from 'events';
async function bootstrap() {
    const app = express();

    app.get('/', (_: Request, res: Response) => {
        return res.send({ message: "hello" });
    });

    app.listen(3000, () => console.log('listening on http://localhost:3000'));
}

//bootstrap().catch(e => console.log(e));
//Player login/start
const character = require('./CharacterMenu.ts');
const player = require('./PlayerMenu.ts');
let loadedPlayerID;
let readplayerDataArray;
const playerCharacterListDataSegmentID = 0;
let playerCharacterList : any = [];
let numberofCharacters : number;
let numberofCharactersCreated : number;
let loadedcharacterID : string;
const dataSegmentSeparator = ";";
const dataSubSegmentSeparator = ",";


const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

inquirer.on("close", function() {
    process.exit(0);
  });
//Start
function startmenu():void{
    inquirer.question("INPUT PLAYER ID TO BEGIN: ", playerIDInput => {
        if (fs.existsSync(`src/PlayerProfiles/${playerIDInput}.txt`)) {
            console.log(`PROFILE FOUND, LOADING PROFILE "${playerIDInput}"...`);
            loadedPlayerID = playerIDInput; 
            playerDataReader();
        } else {
            console.log(`PROFILE NOT FOUND`);
            createnewplayer(playerIDInput);
        };
    });
};
startmenu();

//Player menu


function playerDataReader(): void{
    console.log("reading character IDs");
    let data = fs.readFileSync(path.join("src/PlayerProfiles", `./${loadedPlayerID}.txt`), 'utf-8');
    readplayerDataArray = data.split(dataSegmentSeparator);
    playerCharacterList = readplayerDataArray[playerCharacterListDataSegmentID].split(dataSubSegmentSeparator);
    numberofCharacters = readplayerDataArray[playerCharacterListDataSegmentID+1];
    numberofCharactersCreated = readplayerDataArray[playerCharacterListDataSegmentID+2];
    console.log(`${numberofCharacters} characters available with IDs: ${playerCharacterList}`);
    PlayerMenu();
};

function PlayerMenu(): void{
    inquirer.question("AVAILABLE COMMANDS: NEW, LOAD (CHAR ID), DELETE (CHAR ID):", playerCommandInput => {
        let playerInput = playerCommandInput.toLowerCase().split(/ /);
       if (playerInput [0] == "new"){
            generatenewcharacter();
        } else if (playerInput [0] == "load"){
            let charID = playerInput [1];
            if (ownershipcheck(charID)){
                if (fs.existsSync(`src/PlayerProfiles/${charID}.txt`)){
                    console.log(`LOADING CHARACTER WITH ID: ${charID}`);
                    loadedcharacterID = charID;
                } else {
                    console.log(`INVALID ID`);
                    PlayerMenu();
                };

            } else {
                PlayerMenu();
            }
            
        } else if (playerInput [0] == "delete"){
            deleteCharacter(playerInput [1])
            PlayerMenu();
        } else {
            console.log(`INVALID COMMAND`);
            PlayerMenu();
       };
       
    });


}
function createnewplayer (input): void{
    console.log(`CREATING NEW PROFILE WITH THE ID OF "${input}"...`);
    fs.writeFileSync(`src/PlayerProfiles/${input}.txt`, '');
    loadedPlayerID = input; 
    numberofCharacters = 0;
    numberofCharactersCreated = 0;
    saveplayerData();
    playerDataReader();
    PlayerMenu();
};
function ownershipcheck(charID){
    console.log(`INVALID OWNERSHIP`);
    return charID.startsWith(loadedPlayerID);
};

function generatenewcharacter(): void{
    numberofCharactersCreated++;
    
    let characterID = (`${loadedPlayerID}-${numberofCharactersCreated}`);
    if (numberofCharacters == 0){
        playerCharacterList.splice(playerCharacterList.indexOf(''));
    };
    numberofCharacters++;
    playerCharacterList.push(`${characterID}`);
    console.log(`CREATING NEW CHARACTER WITH ID:${characterID}`);
    fs.writeFileSync(`src/PlayerProfiles/${characterID}.txt`, '');
    generateStats();
    saveplayerData();
    playerDataReader();
    PlayerMenu();
    
};
function deleteCharacter(charID): void{
    if (ownershipcheck(charID)){
        numberofCharacters--;
        playerCharacterList.splice(playerCharacterList.indexOf(`${charID}`),1);
        fs.unlinkSync(`src/PlayerProfiles/${charID}.txt`);
        console.log(`CHARACTER WITH ID:${charID} HAS BEEN DELETED`);
        saveplayerData();
        playerDataReader();
        PlayerMenu();
    } else {
        playerDataReader();
        PlayerMenu();
    }
    
};

function saveplayerData () : void {
   let playerData : string = (`${playerCharacterList};${numberofCharacters};${numberofCharactersCreated}`);
   console.log(playerCharacterList);
    fs.writeFileSync(`src/PlayerProfiles/${loadedPlayerID}.txt`, playerData);
};

function loadCharacter(loadedcharacterID) : void {

    PlayerMenu();
};
function saveCharacter(loadedcharacterID) : void {

};


//inquirer.close();
//separator

//stat generator

const StatNames = ["Strength", "Dexterity", "Constitution","Intelligence","Wisdom","Charisma"];
let statValues: number [] = new Array<number>(5);
let rollResults: number[] = [0, 0 ,0];
function generateStats(): void {
    console.log("- - - Ability score generation - - -");
    for (let i = 0; i<6; i++){
        let roll: number = 0;
        let j: number = 0;
        let droppedroll: number = 0;
        for (let k: number = 0; k<4; k++){
            roll = Math.ceil(Math.random()*5)+1;
           // console.log(`Rolling ${roll}`);
            if (droppedroll === 0) {
                droppedroll = roll;
            } else if (roll < droppedroll) {
                rollResults [j] = droppedroll;
                j++;
                droppedroll = roll;
            } else {
                rollResults [j] = roll;
                j++;
            };
            //console.log(`dropped roll is ${droppedroll}`);
        };
        statValues[i] = rollResults[0] + rollResults[1] + rollResults[2];
        
       console.log(`Character's ${StatNames[i]} is equal to ${statValues[i]}`);
    };
    
};

//Alignment-Deity checker
/*
const orderAlignNames = ["Lawful", "True", "Chaotic"];
const moralityAlignNames = ["Good", "Neutral", "Evil"];
let characterAlign = [2, 0];
console.log("- - - Alignment compatibility check - - -")
console.log(`Character's alignment: ${orderAlignNames[characterAlign[0]]} ${moralityAlignNames[characterAlign[1]]}`);

function checkAlignmentCompatibility (Order : number, morality : number): void {
let compatibleAlignments : string [] = [];
for (let i = 0; i<3; i++){
    for (let j = 0; j<3; j++){
        if ((Math.abs(characterAlign[0]-i)+Math.abs(characterAlign[1]-j))<2){
            compatibleAlignments.push(`${orderAlignNames[i]} ${moralityAlignNames[j]}`);
        }
    }
}
console.log(`Alignments of deities compatible with character's alignment: ${compatibleAlignments}`);
};
checkAlignmentCompatibility(characterAlign[0],characterAlign[1]);
*/