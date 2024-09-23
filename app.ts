import express from 'express';
import dotenv from 'dotenv';
const mongodb = require("./db/connection");
import bodyParser from 'body-parser';
import cors from 'cors';
import { printHelloWorld } from './routes/clothing';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3011;

app
    .use(express.json())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .use((req, res, next) => {

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key')
        res.setHeader(
            'Acces-Control-Allow-Methods',
            'POST, GET, PUT, PATCH, OPTIONS, DELETE')
        next()
    })

    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))

    .use('/api', printHelloWorld);

mongodb.startDb((err: any) => {
    if(err) {
        console.log(err)
    } else{
        app.listen(PORT, () => {
            console.log(`Database is listening and Server running on port ${PORT}`);
        });
    }
});

