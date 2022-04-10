
export default class Item {
    public name : string;
    public strength? : number = 0;
    public dexterity? : number = 0;
    public constitution? : number = 0;
    public intelligence? : number = 0;
    public wisdom? : number = 0;
    public charisma? : number = 0;

    constructor (nameOfItem, statName?, quantity?) {
        this.name = nameOfItem
        switch(statName) {
            case "strength":
                this.strength = 1;
                if (quantity) {
                    this.strength = this.strength*quantity;
                }
            break;
            case "dexterity":
                this.dexterity = 1;
                if (quantity) {
                    this.dexterity = this.dexterity*quantity;
                }
            break;
            case "constitution":
                this.constitution = 1;
                if (quantity) {
                    this.constitution = this.constitution*quantity;
                }
            break;
            case "intelligence":
                this.intelligence = 1;
                if (quantity) {
                    this.intelligence = this.intelligence*quantity;
                }
            break;
            case "wisdom":
                this.wisdom = 1;
                if (quantity) {
                    this.wisdom = this.wisdom*quantity;
                }
            break;
            case "charisma":
                this.charisma = 1;
                if (quantity) {
                    this.charisma = this.charisma*quantity;
                }
            break;
            default:
                console.log("INVALID COMMAND");
            break;
        }
        console.log(this);
        

    }
    public examineItem (){
        console.log(this);
        return this;
    };
}