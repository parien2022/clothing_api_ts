import dotenv from 'dotenv';
import { MongoClient, Db} from 'mongodb';

dotenv.config();

class Database {
    private db: Db | null = null;

    constructor() {}


    public async startDb(): Promise<void> {
        if (this.db) {
            console.log('Database is already initialized!');
            return;
        }

        try{
            const client = await MongoClient.connect(process.env.MONGO_URL || '');
            this.db = client.db('clothing_db');
            console.log('Conected to MongoDB');
        } catch (err){
            throw new Error('Failed to connect to database: ' + err)
        }
    }

    public getDataBase(): Db {
        if(!this.db){
            throw new Error('Database not initialized');
        }
        return this.db;
    }

}

export default new Database();