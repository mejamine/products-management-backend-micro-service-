const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const companyProtoPath = 'company.proto';
const productProtoPath = 'product.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const app = express();


const companyProtoDefinition = protoLoader.loadSync(companyProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const companyProto = grpc.loadPackageDefinition(companyProtoDefinition).company;

const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
    app.use(express.json(),cors(),bodyParser.json(),expressMiddleware(server),);
});

app.get('/companies', (req, res) => {
    const client = new companyProto.CompanyService('localhost:50051',grpc.credentials.createInsecure());
    client.searchCompanies({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.companies);
        }
    });
});

app.get('/companies/:id', (req, res) => {
    const client = new companyProto.CompanyService('localhost:50051',grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getCompany({ company_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.company);
        }
    });
});

app.delete('/companies/:id', (req, res) => {
    const client = new companyProto.CompanyService('localhost:50051',grpc.credentials.createInsecure());
    const id = req.params.id;
    client.deleteCompany({company_id: id}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});

app.post('/companies/:name/:location',async(req,res)=>{
    const client = new companyProto.CompanyService('localhost:50051',grpc.credentials.createInsecure());
    const name = req.params.name;
    const location = req.params.location;
    client.addCompany({name: name,location:location}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});

app.post('/companies/update/:id/:name/:location',(req,res)=>{
    const client = new companyProto.CompanyService('localhost:50051',grpc.credentials.createInsecure());
    const id = req.params.id;
    const name = req.params.name;
    const location = req.params.location;
    client.updateCompany({id:id,name: name,location:location}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});

app.get('/products', (req, res) => {
    const client = new productProto.ProductService('localhost:50052',grpc.credentials.createInsecure());
    client.searchProducts({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.products);
        }
    });
});

app.get('/products/:id', (req, res) => {
    const client = new productProto.ProductService('localhost:50052',grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getProduct({ product_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.product);
        }
    });
});

app.delete('/products/:id', (req, res) => {
    const client = new productProto.ProductService('localhost:50052',grpc.credentials.createInsecure());
    const id = req.params.id;
    client.deleteProduct({product_id: id}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});

app.post('/products/:idcompany/:name',(req,res)=>{
    const client = new productProto.ProductService('localhost:50052',grpc.credentials.createInsecure());
    const idcompany = req.params.idcompany;
    const name = req.params.name;
    client.addProduct({idcompany: idcompany,name:name}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});

app.post('/products/update/:id/:idcompany/:name',(req,res)=>{
    const client = new productProto.ProductService('localhost:50052',grpc.credentials.createInsecure());
    const id = req.params.id;
    const idcompany = req.params.idcompany;
    const name = req.params.name;
    client.updateProduct({id:id,idcompany: idcompany,name:name}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response);
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});