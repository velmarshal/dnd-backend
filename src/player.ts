// create player
// load player
// delete character

//Imports
import fs from 'fs';
import path from 'path';
import Character from './character';

export default class Player {
    public id : string;

    private characters: Character[] = [];

    constructor(input: any) {
        const path = `Players/${input}.json`;
        if (fs.existsSync(path)) {
            console.log(`Player with ID ${input} found. LOADING...`)
            const file = JSON.parse((fs.readFileSync(path, { encoding: 'utf-8' }).toString()));
            this.loadCharacters(file.characters);
            this.id = input;
            console.log(this.getCharacters());
        } else {
            console.log(`Player with ID ${input} not found. CREATING NEW PROFILE...`)
            this.id = input;
        }
        
    };

    private loadCharacters(characters: any[]) {
        for (const character of characters) {
            this.characters.push(new Character(character));
        }
    };

    public loadCharacter(inputName){
        let charToLoadIndex = this.characters.map(x => x.name).indexOf(inputName)
        if (charToLoadIndex != -1){
            console.log(`Character under name ${inputName} has been loaded with index of ${charToLoadIndex}`);
            return charToLoadIndex;

        } else {
            console.log(`Character under name ${inputName} has not been found`);
        }
    };

    public save() {
        fs.writeFileSync(`Players/${this.id}.json`, JSON.stringify(this));
    };

    public addCharacter(name: string): Player {
        this.characters.push(new Character(name));

        return this;
    };

    public getCharacters(): Character[] {
        return this.characters;
    };
    public deleteCharacter(inputName){
        let charToDelIndex = this.characters.map(x => x.name).indexOf(inputName)
        if (charToDelIndex != -1){
            this.characters.splice(charToDelIndex, 1);
            console.log(`Character ${inputName} has been deleted`);
        } else {
            console.log(`Character under name ${inputName} has not been found`);
        }

        
    }
};