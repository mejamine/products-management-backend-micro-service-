const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const productProtoPath = 'product.proto';
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbmicroservice'
});

const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;
const productService = {
    getProduct: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return;
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const idToFetch = call.request.product_id;
            connection.query('SELECT * FROM product WHERE id = ?', [idToFetch], function(err, results, fields) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                if (results.length === 0) {
                   console.log('No record found with ID ' + idToFetch);
                } else {
                    console.log('Query results: ', results[0]);
                    const product =  results[0];
                    callback(null, { product });
                }  
            });
        });
    },

    searchProducts: (call, callback) => {
        const { query } = call.request;
        try {
            connection.connect(function(err) {
                if (err) {
                    console.error('Error connecting to MySQL database: ' + err.stack);
                    return;
                }
                console.log('Connected to MySQL database as id ' + connection.threadId);
                connection.query('SELECT * FROM product', function(err, results, fields) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    const products = results;
                    callback(null, { products });
            });
        });
        } catch (error) {}
    },

    deleteProduct: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return callback(err, null); 
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const idToDelete = call.request.product_id;
            connection.query('DELETE FROM product WHERE id = ?', [idToDelete], function(err, results, fields) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    callback(err, null); 
                }
                if (results.affectedRows === 0) {
                    console.log('No record found with ID ' + idToDelete);
                    callback(null, {success:false});
                } else {
                    console.log('product deleted successfully');
                    callback(null, {success:true});
                }
            });
        });
    },

    addProduct: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return;
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const name = call.request.name;
            const idcompany = call.request.idcompany;
            connection.query("INSERT INTO product (`id`, `idcompany`, `name`) VALUES (null, ?, ?)", [idcompany,name], function(err, results, fields) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                if (results.length === 0) {
                    console.log('No record found with ID ');
                    console.log(results);
                } else {
                    console.log('Query results: ', results.insertId);
                    connection.connect(function(err) {
                        if (err) {
                            console.error('Error connecting to MySQL database: ' + err.stack);
                            return;
                        }
                        console.log('Connected to MySQL database as id ' + connection.threadId);
                        const idToFetch = results.insertId; 
                        connection.query('SELECT * FROM product WHERE id = ?', [idToFetch], function(err, results, fields) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            if (results.length === 0) {
                                console.log('No record found with ID ' + idToFetch);
                            } else {
                                console.log('Query results: ', results[0]);
                                const product =  results[0];
                                callback(null, { product });
                            } 
                        });
                    });
                }
            });
        });
    },

    updateProduct: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return;
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const id = call.request.id;
            const idcompany = call.request.idcompany;
            const name = call.request.name;
            connection.query("UPDATE `product` SET `idcompany` = ?, `name` = ? WHERE `product`.`id` = ?;", [idcompany, name,id], function(err, results, fields) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                if (results.length === 0) {
                    console.log('No record found with ID ');
                    console.log(results);
                } else {
                    console.log('sucess');
                    connection.connect(function(err) {
                        if (err) {
                            console.error('Error connecting to MySQL database: ' + err.stack);
                            return;
                        }
                        console.log('Connected to MySQL database as id ' + connection.threadId);
                        const idToFetch = id; 
                        connection.query('SELECT * FROM product WHERE id = ?', [idToFetch], function(err, results, fields) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            if (results.length === 0) {
                                console.log('No record found with ID ' + idToFetch);
                            } else {
                                console.log('Query results: ', results[0]);
                                const product =  results[0];
                                callback(null, { product });
                            }  
                        });
                    });
                }
            });
        });
    }

};

const server = new grpc.Server();
server.addService(productProto.ProductService.service, productService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),(err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});
console.log(`Microservice de product en cours d'exécution sur le port ${port}`);