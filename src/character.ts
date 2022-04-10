

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
import { copyFileSync } from 'fs';
import Item from './item';
export default class Character {

    public name : string;
    private class : string;
    private strength : number;
    private dexterity : number;
    private constitution : number;
    private intelligence : number;
    private wisdom : number;
    private charisma : number;
    private items: Item[] = [];

    // Creates new character
    constructor (nameOrCharacter) {
        if (typeof nameOrCharacter === 'string') {
            this.name = nameOrCharacter;
            this.class = "Fighter";
            this.strength = this.rollStat();
            this.dexterity = this.rollStat();
            this.constitution = this.rollStat();
            this.intelligence = this.rollStat();
            this.wisdom = this.rollStat();
            this.charisma = this.rollStat();
        } else {
            for (const field of Object.keys(nameOrCharacter)) {
                this[field] = nameOrCharacter[field];
            }
        }
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
    public addItem(name: string, stat?: string, quantity?: number): Character {
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
        return;
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
            console.log(`Character's item ${inputName} has been deleted`);
        } else {
            console.log(`Character's item under name ${inputName} has not been found`);
        }

        
    }
    public listItems() {
        console.log(this.items);
    }
};