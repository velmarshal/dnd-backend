import express, {Request, Response} from 'express';
import path from 'path';
import fs from 'fs';
import util from 'util'
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

let LoadedPlayerID;
const readline = require('readline')
let ReadPlayerDataArray;
const PlayerCharacterListDataSegmentID = 0;
let PlayerCharacterList : any = [];
let NumberofCharacters : number;
let NumberofCharactersCreated : number;
let LoadedCharacterID : number;
const DataSegmentSeparator = ";";
const DataSubSegmentSeparator = ",";


const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

inquirer.on("close", function() {
    process.exit(0);
  });
//Start
function startmenu():void{
    inquirer.question("INPUT PLAYER ID TO BEGIN: ", PlayerIDInput => {
        if (fs.existsSync(`src/PlayerProfiles/${PlayerIDInput}.txt`)) {
            console.log(`PROFILE FOUND, LOADING PROFILE "${PlayerIDInput}"...`);
            LoadedPlayerID = PlayerIDInput; 
            PlayerDataReader();
        } else {
        console.log(`PROFILE NOT FOUND`);
        createnewplayer(PlayerIDInput);
        };
    });
};
startmenu();

//Player menu


function PlayerDataReader(): void{
    console.log("reading character IDs");
    let Data = fs.readFileSync(path.join("src/PlayerProfiles", `./${LoadedPlayerID}.txt`), 'utf-8');
    ReadPlayerDataArray = Data.split(DataSegmentSeparator);
    PlayerCharacterList = ReadPlayerDataArray[PlayerCharacterListDataSegmentID].split(DataSubSegmentSeparator);
    NumberofCharacters = ReadPlayerDataArray[PlayerCharacterListDataSegmentID+1];
    NumberofCharactersCreated = ReadPlayerDataArray[PlayerCharacterListDataSegmentID+2];
    console.log(`${NumberofCharacters} characters available with IDs: ${PlayerCharacterList}`);
    PlayerMenu();
};

function PlayerMenu(): void{
    inquirer.question("AVAILABLE COMMANDS: NEW, LOAD (CHAR ID), DELETE (CHAR ID):", PlayerCommandInput => {
        let PlayerInput = PlayerCommandInput.toLowerCase().split(/ /);
       if (PlayerInput [0] == "new"){
            generatenewcharacter();
        } else if (PlayerInput [0] == "load"){
            let CharID = PlayerInput [1];
            if (ownershipcheck(CharID)){
                if (fs.existsSync(`src/PlayerProfiles/${CharID}.txt`)){
                    console.log(`LOADING CHARACTER WITH ID: ${CharID}`);
                    LoadedCharacterID = CharID;
                } else {
                    console.log(`INVALID ID`);
                    PlayerMenu();
                };

            } else {
                PlayerMenu();
            }
            
        } else if (PlayerInput [0] == "delete"){
            deleteCharacter(PlayerInput [1])
            PlayerMenu();
        } else {
        console.log(`INVALID COMMAND`);
        PlayerMenu();
       };
       
    });


}
function createnewplayer (Input): void{
    console.log(`CREATING NEW PROFILE WITH THE ID OF "${Input}"...`);
    fs.writeFileSync(`src/PlayerProfiles/${Input}.txt`, '');
    LoadedPlayerID = Input; 
    NumberofCharacters = 0;
    NumberofCharactersCreated = 0;
    saveplayerdata();
    PlayerDataReader();
    PlayerMenu();
};
function ownershipcheck(CharID){
    console.log(`INVALID OWNERSHIP`);
    return CharID.startsWith(LoadedPlayerID);
};

function generatenewcharacter(): void{
    NumberofCharactersCreated++;
    
    let CharacterID = (`${LoadedPlayerID}-${NumberofCharactersCreated}`);
    if (NumberofCharacters == 0){
        PlayerCharacterList.splice(PlayerCharacterList.indexOf(''));
    };
    NumberofCharacters++;
    PlayerCharacterList.push(`${CharacterID}`);
    console.log(`CREATING NEW CHARACTER WITH ID:${CharacterID}`);
    fs.writeFileSync(`src/PlayerProfiles/${CharacterID}.txt`, '');
    generateStats();
    saveplayerdata();
    PlayerDataReader();
    PlayerMenu();
    
};
function deleteCharacter(CharID): void{
    if (ownershipcheck(CharID)){
        NumberofCharacters--;
        PlayerCharacterList.splice(PlayerCharacterList.indexOf(`${CharID}`),1);
        fs.unlinkSync(`src/PlayerProfiles/${CharID}.txt`);
        console.log(`CHARACTER WITH ID:${CharID} HAS BEEN DELETED`);
        saveplayerdata();
        PlayerDataReader();
        PlayerMenu();
    } else {
        PlayerDataReader();
        PlayerMenu();
    }
    
};

function saveplayerdata () : void {
   let PlayerData : string = (`${PlayerCharacterList};${NumberofCharacters};${NumberofCharactersCreated}`);
   console.log(PlayerCharacterList);
    fs.writeFileSync(`src/PlayerProfiles/${LoadedPlayerID}.txt`, PlayerData);
};

function loadCharacter(LoadedCharacterID) : void {

    PlayerMenu();
};
function saveCharacter(LoadedCharacterID) : void {

};


//inquirer.close();
//separator

//stat generator

const StatNames = ["Strength", "Dexterity", "Constitution","Intelligence","Wisdom","Charisma"];
let CharacterName: string = "Testio Testisimus";
let CharacterClass: string = "Fighter";
let StatValues: number [] = new Array<number>(5);
let RollResults: number[] = [0, 0 ,0];
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
                RollResults [j] = droppedroll;
                j++;
                droppedroll = roll;
            } else {
                RollResults [j] = roll;
                j++;
            };
            //console.log(`dropped roll is ${droppedroll}`);
        };
        StatValues[i] = RollResults[0] + RollResults[1] + RollResults[2];
        
       console.log(`Character's ${StatNames[i]} is equal to ${StatValues[i]}`);
    };
    
};

//Alignment-Deity checker
/*
const OrderAlignNames = ["Lawful", "True", "Chaotic"];
const MoralityAlignNames = ["Good", "Neutral", "Evil"];
let CharacterAlign = [2, 0];
console.log("- - - Alignment compatibility check - - -")
console.log(`Character's alignment: ${OrderAlignNames[CharacterAlign[0]]} ${MoralityAlignNames[CharacterAlign[1]]}`);

function CheckAlignmentCompatibility (Order : number, Morality : number): void {
let CompatibleAlignments : string [] = [];
for (let i = 0; i<3; i++){
    for (let j = 0; j<3; j++){
        if ((Math.abs(CharacterAlign[0]-i)+Math.abs(CharacterAlign[1]-j))<2){
            CompatibleAlignments.push(`${OrderAlignNames[i]} ${MoralityAlignNames[j]}`);
        }
    }
}
console.log(`Alignments of deities compatible with character's alignment: ${CompatibleAlignments}`);
};
CheckAlignmentCompatibility(CharacterAlign[0],CharacterAlign[1]);
*/