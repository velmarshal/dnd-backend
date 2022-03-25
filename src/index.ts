import express, {Request, Response} from 'express';

async function bootstrap() {
    const app = express();

    app.get('/', (_: Request, res: Response) => {
        return res.send({ message: "hello" });
    });

    app.listen(3000, () => console.log('listening on http://localhost:3000'));
}

bootstrap().catch(e => console.log(e));
