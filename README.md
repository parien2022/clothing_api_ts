# Overview

This project is intended to provide a Clothing API that handles many endpoints for getting, creating, updating, deleting and also performing calculations about clothing data. I have created this API using TypeScript lenguage using OOP classes that helped me to enhance my knowledge about types and methodology of TS.

The software runs an API listening on a port and connected to a MongoDB, it waits for requests with different endpoints, then performs CURD operations and calulations depending on the request, it responses back with a successfull message or specific data, I have demonstrated the use of TS lenguage by declaring every type of variable, parameters and Promises that the software uses, I use ts-node to compile the TS into plain JS, so node can run the project correctly

[Software Demo Video](https://drive.google.com/file/d/15CaWG9vnpk7dWFpaUA79l5FfdoAm40RM/view?usp=sharing)

# Development Environment

TypeScript lenguage to build the API.
MongoDB database to storage clothes.
Express to handle API and mnogodb for DB connection.
ts-node and nodemon to compile TS into JS.
ESLint configured to lint TS.

The following dependencies were used:
"dotenv": "^16.4.5",
"express": "^4.21.0",
"mongoose": "^8.6.3",
"@eslint/js": "^9.11.1",
"@types/cors": "^2.8.17",
"@types/express": "^4.17.21",
"@types/jest": "^29.5.13",
"@types/node": "^22.5.5",
"@typescript-eslint/eslint-plugin": "^8.7.0",
"@typescript-eslint/parser": "^8.7.0",
"body-parser": "^1.20.3",
"cors": "^2.8.5",
"eslint": "^9.11.1",
"globals": "^15.9.0",
"jest": "^29.7.0",
"mongodb": "^6.9.0",
"nodemon": "^3.1.7",
"ts-jest": "^29.2.5",
"ts-node": "^10.9.2",
"typescript": "^5.6.2",
"typescript-eslint": "^8.7.0"

Sample endpoints:
GET: http://localhost:3010/api/getAll
GET: http://localhost:3010/api/getById/66f0828938f2c68604a5bec7
POST: http://localhost:3010/api/createClothes
PUT: http://localhost:3010/api/updateClothes/66f3c1d66b5ec64c2234f669
DELETE: http://localhost:3010/api/deleteClothes/66f3c1d66b5ec64c2234f669
GET: http://localhost:3010/api/getStockBySize

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [digitalocean](https://www.digitalocean.com/community/tutorials/typescript-new-project)
- [DEV](https://dev.to/realsteveig/nodejs-and-typescript-tutorial-build-a-rest-api-with-typescript-nodejs-and-a-file-based-storage-system-2l61)

# Future Work

- Create API Documentation using Swagger
- Use of mongoose for DB models
- Create tests using Jest