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
            res.status(400).json({ message: err instanceof Error ? err.message : 'Error getting all clothess'});
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try{
            await this.initializeDb();
            if(!this.db){
                throw new Error('Database not initialized');
            }
            else if(!ObjectId.isValid(req.params.id)){
                res.status(400).json({message: 'Must use a valid clothes id'});
                return;
            }

            const clothesId = new ObjectId(req.params.id);
            const clothes = await this.db.collection('clothes').find({_id: clothesId}).toArray();

            if (clothes.length == 0){
                res.status(404).json({message: 'Clothes not found'});
                return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(clothes[0]);
        }catch (err){
            res.status(400).json({ message: err instanceof Error ? err.message : 'Error getting Clothes by id'});
        }
    }

    public async createClothes(req: Request, res: Response): Promise<void> {
        try{
            await this.initializeDb();
            if(!this.db){
                throw new Error('Database not initialized');
            }

            const clothes = {
                "name": req.body.name,
                "size": req.body.size,
                "color": req.body.color,
                "price": req.body.price,
                "inStock": req.body.inStock
            }

            const response = await this.db.collection('clothes').insertOne(clothes);

            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({message: 'Successfully Created', _id: response.insertedId});
        }catch (err){
            res.status(500).json({ message: err instanceof Error ? err.message : 'Error creating clothes'});
        }
    }

    public async updateClothes(req: Request, res: Response): Promise<void> {
        try{
            await this.initializeDb();
            if(!this.db){
                throw new Error('Database not initialized');
            }
            else if(!ObjectId.isValid(req.params.id)){
                res.status(400).json({message: 'Must use a valid clothes id'});
                return;
            }

            const clothes = {
                "name": req.body.name,
                "size": req.body.size,
                "color": req.body.color,
                "price": req.body.price,
                "inStock": req.body.inStock
            }

            const clothesId = new ObjectId(req.params.id);
            const response = await this.db.collection('clothes').replaceOne({_id: clothesId}, clothes);

            res.setHeader('Content-Type', 'application/json');
            if (response.modifiedCount > 0){
                res.status(200).json({message: 'Successfully updated'});
            }
        }catch (err){
            res.status(500).json({ message: err instanceof Error ? err.message : 'Error updating clothes'});
        }
    }

    public async deleteClothes(req: Request, res: Response): Promise<void> {
        try{
            await this.initializeDb();
            if(!this.db){
                throw new Error('Database not initialized');
            }
            else if(!ObjectId.isValid(req.params.id)){
                res.status(400).json({message: 'Must use a valid clothes id'});
                return;
            }

            const clothesId = new ObjectId(req.params.id);
            const response = await this.db.collection('clothes').deleteOne({_id: clothesId});

            res.setHeader('Content-Type', 'application/json');
            if (response.deletedCount > 0){
                res.status(200).json({message: 'Successfully deleted'});
            }
        }catch (err){
            res.status(500).json({ message: err instanceof Error ? err.message : 'Error deleting clothes'});
        }
    }

    
}

export default new ClothesController();