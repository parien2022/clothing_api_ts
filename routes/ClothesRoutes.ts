import { Router, Request, Response } from "express";
import ClothesController from "../controllers/ClothesController";


class ClothesRoutes {

    public router: Router;

    constructor(){
        this.router = Router();
        this. initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/clothes', (req: Request, res: Response) => ClothesController.getAll(req, res))
    }
    
}

export default new ClothesRoutes().router;