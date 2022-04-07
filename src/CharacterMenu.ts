

//check character ownership
// roll stat
// change name
// change class
// change alignment
// pick deity
// add item
// remove item
// roll dice
// perform action

// create character
// save character
// load character 
import Player from './PlayerMenu';
 let loadedCharacter;
export default class Character {

    private name : string;
    private class : string;
    //private alignment : string;
    private strength : number;
    private dexterity : number;
    private constitution : number;
    private intelligence : number;
    private wisdom : number;
    private charisma : number;

    // Creates new character
    public static createCharacter (characterID) {
        loadedCharacter = new Character;
        loadedCharacter.name = characterID;
        loadedCharacter.class = "Fighter";
        loadedCharacter.strength = this.rollStat();
        loadedCharacter.dexterity = this.rollStat();
        loadedCharacter.constitution = this.rollStat();
        loadedCharacter.intelligence = this.rollStat();
        loadedCharacter.wisdom = this.rollStat();
        loadedCharacter.charisma = this.rollStat();
        this.returnLoadedCharacter();
        return loadedCharacter;
    };

    public static loadCharacter (playerID, characterID) {

    };

    public static returnLoadedCharacter () {
        console.log(`returning loaded character charmenu to player menu: ${loadedCharacter}`)
        Player.addCharacter(loadedCharacter);
    };

    public static rollStat () {
        let roll;
        let droppedRoll = 0;
        let rollResults : number [] = [0, 0 ,0];
        let j = 0;
        for (let k = 0; k<4; k++){
            roll = Math.ceil(Math.random()*5)+1;
            //console.log(`Rolling ${roll}`);
            if (droppedRoll === 0) {
                droppedRoll = roll;
               // console.log(`dropped roll is ${droppedRoll}`);
            } else if (roll < droppedRoll) {
                rollResults [j] = droppedRoll;
                j++;
                droppedRoll = roll;
               // console.log(`dropped roll is ${droppedRoll}`);
            } else {
                rollResults [j] = roll;
                j++;
            };
                
                
            };
            let totalRoll = rollResults[0] + rollResults[1] + rollResults[2];
                //console.log(`Final stat ${totalRoll}`);
                return totalRoll;
        };
    
    public static addItem (itemName){

    };

    public static removeItem (itemName) {

    };

    public static listItem (itemName) {

    };
};

