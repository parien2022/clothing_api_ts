import express, { Application } from 'express';
import dotenv from 'dotenv';
import db from './db/Database'
import bodyParser from 'body-parser';
import cors from 'cors';
import ClothesRoutes from './routes/ClothesRoutes';

dotenv.config();

class App {

    public app: Application;
    private port: number | string;

    constructor(){
        this.app = express(),
        this.port = process.env.PORT || 3011;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDbAndStartServer();
    }


    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}));
        this.app.use(this.setupHeaders);
    }

    private setupHeaders(req: express.Request, res: express.Response, next: express.NextFunction){
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key')
        res.setHeader(
            'Acces-Control-Allow-Methods',
            'POST, GET, PUT, PATCH, OPTIONS, DELETE')
        next()
    }

    private initializeRoutes() {
        this.app.use('/api', ClothesRoutes);
    }

    private async initializeDbAndStartServer() {
        try{
            await db.startDb();
            this.startServer();
        } catch(err){
            console.log('Database connection failed', err);
        }
    }

    private startServer(){
        this.app.listen(this.port, () => {
            console.log(`Database is listening and Server running on port ${this.port}`);
        });
    }
}

new App();

