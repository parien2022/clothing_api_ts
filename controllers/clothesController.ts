import { Request, Response} from 'express';
import dbObject from "../db/Database";
import { ObjectId, Db } from 'mongodb';

class ClothesController {
    private db: Db | null = null;

    constructor() {}

    private async initializeDb(): Promise<void> {
        try{
            this.db = await dbObject.getDataBase();
        } catch(err){
            console.error('Failed to initialize database: ' + err);
        }
    }


    public async getAll(req: Request, res: Response): Promise<void> {
        try{
            await this.initializeDb();
            if(!this.db){
                throw new Error('Database not initialized');
            }

            const clothes = await this.db.collection('clothes').find().toArray();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(clothes);
        }catch (err){
            res.status(400).json({ message: err instanceof Error ? err.message : 'Unknown error'});
        }
    }
}

export default new ClothesController();