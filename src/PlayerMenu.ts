// create player
// load player
// delete character

//Imports
import fs from 'fs';
import path from 'path';


let loadedPlayerCharacterArray = []; 
let  datSep = "|_|";


export default class Player {
    private id : string;
    private numChar : number;
    public static generatePlayerData (playerID) {
    };

    //Creates new player profile
    public static createPlayer (playerID) : void {
        console.log(`CREATING NEW PROFILE WITH THE ID OF "${playerID}"...`);
        fs.writeFileSync(`Players/${playerID}.txt`, ''); 
        loadedPlayerData = new Player ();
        loadedPlayerData.id = playerID;
        loadedPlayerData.numChar = 0;
        this.loadPlayer(playerID);

    };

    //Saves player data to txt
    public static writePlayer (){
        fs.writeFileSync(`Players/${loadedPlayerData.id}.txt`, this.createPlayerDataDump ());
    };

    //Loads player with given ID from txt
    public static loadPlayer (playerID) {
        if (this.checkPlayerExistance (playerID)){
            let data = fs.readFileSync(path.join("Players/", `./${playerID}.txt`), 'utf-8');
            console.log(`LOAING PROFILE WITH THE ID OF "${playerID}"...`);
            this.parsePlayerDataDump (data);
            //ucitaj player data iz txta
            return loadedPlayerData;
           // LoadedPlayerData = new player (Data);
        } else {
            console.log ("NO PLAYER WITH THIS ID EXISTS...")
            this.createPlayer(playerID);
        };
    };
    private static createPlayerDataDump (){
        let dataDump = `${loadedPlayerData}${datSep}${loadedPlayerCharacterArray}`
        return dataDump;
    };
    public static addCharacter(charData){
        console.log(`playermenu recieved char data${charData}`);
        loadedPlayerCharacterArray.push(charData);
        console.log(`character array contains: ${loadedPlayerCharacterArray} `);
        
        return "character added";
    };
    private static parsePlayerDataDump (data){
        let dataDumpArray = data.split(datSep);
        loadedPlayerData = dataDumpArray [0];
        loadedPlayerCharacterArray = dataDumpArray [1];
    };
    

    //Checks if player with ID exists
    private static checkPlayerExistance (playerID){
         if (fs.existsSync(`Players/${playerID}.txt`)){
            return true;
         } else {
             return false;
         };
    };
    public static listCharacters(){
        console.log(loadedPlayerCharacterArray);
    };

};
let loadedPlayerData = new Player();
