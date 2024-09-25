import { Request, Response} from 'express';
import dbObject from "../db/Database";
import { ObjectId, Db, WithId, Document } from 'mongodb';

// Sets interface with type WithId<Document> and sets object types for its properties
interface Clothes extends WithId<Document> {
    name: string;
    size: string;
    color: string;
    price: number;
    inStock: boolean;
}

// This class handles every interaction with MongoDB as well as NoSql Satatements related
class ClothesController {
    private db: Db | null = null;

    constructor() {}

    //Gets DB instance
    private async getDbInstance(): Promise<void> {
        try{
            this.db = await dbObject.getDataBase();
        } catch(err){
            console.error('Failed to initialize database: ' + err);
        }
    }

    // Recursively iterates through a list of objects with the type Clothes[] interface and adds 1 to the
    // totalStock variable in case is true.
    private async getTotalStockBySizeRecursive(clothes: Clothes[], index: number= 0, totalStock: number = 0): Promise<number>{
        if (index >= clothes.length){
            return totalStock;
        }
        if (clothes[index].inStock) {
            totalStock += 1;
        }
        return this.getTotalStockBySizeRecursive(clothes, index + 1, totalStock);
    }

    // Retrieves all Clothes from DB
    // Sample endpoint: http://localhost:3010/api/getAll
    public async getAll(req: Request, res: Response): Promise<void> {
        try{
            await this.getDbInstance();
            if(!this.db){
                throw new Error('Failed to get Database instance');
            }

            const clothes = await this.db.collection('clothes').find().toArray();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(clothes);
        }catch (err){
            res.status(400).json({ message: err instanceof Error ? err.message : 'Error getting all clothes'});
        }
    }

    // Retrieves one clothes by ID
    // Sample endpoint: http://localhost:3010/api/getById/66f11216367fcb9619fa6032
    public async getById(req: Request, res: Response): Promise<void> {
        try{
            await this.getDbInstance();
            if(!this.db){
                throw new Error('Failed to get Database instance');
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

    // Creates clothes item into MongoDB
    // Sample endpoint: http://localhost:3010/api/createClothes
    // Uses a body in the request
    public async createClothes(req: Request, res: Response): Promise<void> {
        try{
            await this.getDbInstance();
            if(!this.db){
                throw new Error('Failed to get Database instance');
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

    // Updates clothes item into MongoDB
    // Sample endpoint: http://localhost:3010/api/updateClothes/66f11216367fcb9619fa6032
    // Uses a body in the request
    public async updateClothes(req: Request, res: Response): Promise<void> {
        try{
            await this.getDbInstance();
            if(!this.db){
                throw new Error('Failed to get Database instance');
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

    // Deletes clothes item from MongoDB
    // Sample endpoint: http://localhost:3010/api/deleteClothes/66f11216367fcb9619fa6032
    public async deleteClothes(req: Request, res: Response): Promise<void> {
        try{
            await this.getDbInstance();
            if(!this.db){
                throw new Error('Failed to get Database instance');
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

    // Retrieves clothes by size and calculates stock available
    public async getStockBySize(req: Request, res: Response): Promise<void> {
        try{
            await this.getDbInstance();

            if(!this.db) {
                throw new Error('Failed to get Database instance');
            }
            const size = req.body.size as string;
            if (!size) {
                res.status(400).json({message: 'size parameter is required in the body'})
            }
            console.log(`Searching clothes with size: ${size} ...`);

            const clothesDoc = await this.db?.collection('clothes').find({ size }).toArray();

            const clothes: Clothes[] = clothesDoc.map(doc => ({
                _id: doc._id,
                name: doc.name,
                size: doc.size,
                color: doc.color,
                price: doc.price,
                inStock: doc.inStock
            }));

            const stock = await this.getTotalStockBySizeRecursive(clothes);
            console.log(`Found ${stock} in stock with size ${size}`);
            res.setHeader('Content-type', 'application/json');
            res.status(200).json({message: 'Total stock', stock});
        } catch(err){
            res.status(400).json({ message: err instanceof Error ? err.message : 'Error getting clothes by category and size'});
        }
        
    }


    
}

export default new ClothesController();