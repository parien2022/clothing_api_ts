import { Router, Request, Response } from "express";
import ClothesController from "../controllers/ClothesController";


class ClothesRoutes {

    public router: Router;

    constructor(){
        this.router = Router();
        this. initializeRoutes();
    }

    // Sets every endpoint for clothing API with the corresponding HTTP method.
    // Calls controllers that handle middlewares wiht DB interaction
    private initializeRoutes() {
        this.router.get('/getAll', (req: Request, res: Response) => ClothesController.getAll(req, res));
        this.router.get('/getById/:id', (req: Request, res: Response) => ClothesController.getById(req, res));
        this.router.post('/createClothes/', (req: Request, res: Response) => ClothesController.createClothes(req, res));
        this.router.put('/updateClothes/:id', (req: Request, res: Response) => ClothesController.updateClothes(req, res));
        this.router.delete('/deleteClothes/:id', (req: Request, res: Response) => ClothesController.deleteClothes(req, res));
        this.router.get('/getStockBySize', (req: Request, res: Response) => ClothesController.getStockBySize(req, res));
    }
    
}

export default new ClothesRoutes().router;