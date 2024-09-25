import express, { Application } from 'express';
import dotenv from 'dotenv';
import db from './db/Database'
import bodyParser from 'body-parser';
import cors from 'cors';
import ClothesRoutes from './routes/ClothesRoutes';

dotenv.config();

// Class App in charge of running the complete API on a specific port and connecting to MongoDB
class App {

    public app: Application;
    private port: number | string;

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3011;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDbAndStartServer();
    }

    // Sets json from express functionality and bodyparser for the app
    // Sets cors methods allowed
    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}));
        this.app.use(this.setupHeaders);
    }

    // Sets specific headers for response
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

    // Calls the Routes for clothing API endpoints
    private initializeRoutes() {
        this.app.use('/api', ClothesRoutes);
    }

    // Initializes MongoDB client
    private async initializeDbAndStartServer() {
        try{
            await db.startDb();
            this.startServer();
        } catch(err){
            console.log('Database connection failed', err);
        }
    }

    // Starts server on a local port
    private startServer(){
        this.app.listen(this.port, () => {
            console.log(`Database is listening and Server running on port ${this.port}`);
        });
    }
}

// Executes App class
new App();

