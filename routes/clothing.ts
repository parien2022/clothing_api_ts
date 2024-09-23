import { Router } from "express";
const clothesController = require("../controllers/clothesController");

const router = Router();

router.get('/clothes', clothesController.getAll);

module.exports = Router;