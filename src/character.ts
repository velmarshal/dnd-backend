

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
    public ownerID : string;
    private class : string;
    private strength : number;
    private dexterity : number;
    private constitution : number;
    private intelligence : number;
    private wisdom : number;
    private charisma : number;
    private items: Item[] = [];

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
    public rerollStats(){
        this.strength = this.rollStat();
        this.dexterity = this.rollStat();
        this.constitution = this.rollStat();
        this.intelligence = this.rollStat();
        this.wisdom = this.rollStat();
        this.charisma = this.rollStat();
        if (this.items.length){
            this.items.forEach(element =>{
                this.strength += element.strength;
                this.dexterity += element.dexterity;
                this.constitution += element.constitution;
                this.intelligence += element.intelligence;
                this.wisdom += element.wisdom;
                this.charisma += element.charisma;

            })
        }
        console.log(this);
    };
    public addItem(name: string, stat?: string, quantity?: number) {
        if (quantity && quantity !=0){
            console.log(`Creating calling class item to create item with ${stat} of ${quantity}`)
            this.items.push(new Item(name, stat, Math.abs(quantity)));
        } else {
            console.log(`Creating calling class item to create item with ${stat} of 1`)
            this.items.push(new Item(name, stat, 1));
        }
        let element = this.items[this.items.length-1];
        this.strength += element.strength;
        this.dexterity += element.dexterity;
        this.constitution += element.constitution;
        this.intelligence += element.intelligence;
        this.wisdom += element.wisdom;
        this.charisma += element.charisma;
        return this.items[this.items.length-1];
    };
    public deleteItem(inputName){
        let itemToDelIndex = this.items.map(x => x.name).indexOf(inputName)
        if (itemToDelIndex != -1){
            let element = this.items[itemToDelIndex];
            this.strength -= element.strength;
            this.dexterity -= element.dexterity;
            this.constitution -= element.constitution;
            this.intelligence -= element.intelligence;
            this.wisdom -= element.wisdom;
            this.charisma -= element.charisma;
            this.items.splice(itemToDelIndex, 1);
            console.log(`${this.name}'s item ${inputName} has been deleted`);
        } else {
            console.log(`${this.name}'s item under name ${inputName} has not been found`);
        }

        
    }
    public listItems() {
        if (this.items.length === 0){
            console.log("CHARACTER HAS NO ITEMS, USE ADDITEM TO ADD AN ITEM.");
        } else{
            console.log(this.items);
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
        this.items = char.items;
    }
};