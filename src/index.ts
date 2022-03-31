import express, {Request, Response} from 'express';

//import EventEmitter from 'events';
async function bootstrap() {
    const app = express();

    app.get('/', (_: Request, res: Response) => {
        return res.send({ message: "hello" });
    });

    app.listen(3000, () => console.log('listening on http://localhost:3000'));
}

bootstrap().catch(e => console.log(e));
console.log('test');

//separator

//stat generator
const StatNames = ["Strength", "Dexterity", "Constitution","Intelligence","Wisdom","Charisma"];
let StatValues: number [] = new Array<number>(5);
let RollResults: number[];

function generateStats(): void {
    for (let i = 0; i<6; i++){
        let roll: number = 0;
        let j: number = 0;
        let droppedroll: number = 0;
        RollResults = [19, 19, 19];
        for (let k: number = 0; k<4; k++){
            roll = Math.ceil(Math.random()*5)+1;
            console.log(`Rolling ${roll}`);
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
            console.log(`dropped roll is ${droppedroll}`);
        };
        let rollsum = RollResults[0] + RollResults[1] + RollResults[2];
        StatValues[i] = rollsum;
        
        console.log(`Character's ${StatNames[i]} is equal to ${StatValues[i]}`);
    };
    
};

generateStats();
