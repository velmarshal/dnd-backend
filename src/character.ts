

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
//import { copyFileSync } from 'fs';
import Item from './item';
export default class Character { 
    public name : string;
    public ownerID : any;
    private class : string;
    private strength : number;
    private dexterity : number;
    private constitution : number;
    private intelligence : number;
    private wisdom : number;
    private charisma : number;
    //private items: Item[] = [];
    public itemIDs: string[] = [];

    // Creates new character
    constructor (nameCharacter, loadedPlayerID) {
            this.name = nameCharacter;
            this.ownerID = loadedPlayerID;
            this.class = "Fighter";
            this.strength = this.rollStat();
            this.dexterity = this.rollStat();
            this.constitution = this.rollStat();
            this.intelligence = this.rollStat();
            this.wisdom = this.rollStat();
            this.charisma = this.rollStat();
    };

    private rollStat () {
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
    public rerollStats(itmStr : number , itmDex : number , itmCon : number , itmInt : number , itmWis : number , itmCha : number ){
        this.strength = this.rollStat();
        this.dexterity = this.rollStat();
        this.constitution = this.rollStat();
        this.intelligence = this.rollStat();
        this.wisdom = this.rollStat();
        this.charisma = this.rollStat();
        if (this.itemIDs.length>0){
            this.strength += itmStr;
            this.dexterity += itmDex;
            this.constitution += itmCon;
            this.intelligence += itmInt;
            this.wisdom += itmWis;
            this.charisma += itmCha;
        }
        console.log(this);
    };
    public addItem(existance : boolean , name: string, stat?: string, quantity?, itemToLoad? : Item) {
        let item : Item;
        if (quantity && quantity !=0){
        } else {
            quantity = 1;
        }
        if(existance === false){
            item = new Item(name, stat, quantity);
            console.log(`Creating calling class item to create item with ${stat} of ${quantity}`)
        } else {
            item = itemToLoad;
        }
        let element = item;
        this.strength += element.strength;
        this.dexterity += element.dexterity;
        this.constitution += element.constitution;
        this.intelligence += element.intelligence;
        this.wisdom += element.wisdom;
        this.charisma += element.charisma;
        this.itemIDs.push(item.name);
        return item;
    };
    public deleteItem(itemObject : Item){
        let itemToDelIndex = this.itemIDs.indexOf(itemObject.name);
        if (itemToDelIndex != -1){
            let element = itemObject;
            this.strength -= element.strength;
            this.dexterity -= element.dexterity;
            this.constitution -= element.constitution;
            this.intelligence -= element.intelligence;
            this.wisdom -= element.wisdom;
            this.charisma -= element.charisma;
            this.itemIDs.splice(itemToDelIndex, 1);
            console.log(`${this.name}'s item ${itemObject.name} has been deleted`);
        } else {
            console.log(`${this.name}'s item under name ${itemObject.name} has not been found`);
        }

        
    }
    public listItems() {
        if (this.itemIDs.length === 0){
            console.log("CHARACTER HAS NO ITEMS, USE ADDITEM TO ADD AN ITEM.");
        } else{
            console.log(this.itemIDs);
        }
        
    }
    public loadCharacterFromJSON(char){
        this.name = char.name;
        this.ownerID = char.ownerID;
        this.strength = char.strength;
        this.dexterity = char.dexterity;
        this.constitution = char.constitution;
        this.intelligence = char.intelligence;
        this.wisdom = char.wisdom;
        this.charisma = char.charisma;
        this.itemIDs = char.itemIDs;
    }
};