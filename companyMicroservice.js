const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const companyProtoPath = 'company.proto';
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbmicroservice'
});

const companyProtoDefinition = protoLoader.loadSync(companyProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const companyProto = grpc.loadPackageDefinition(companyProtoDefinition).company;
const companyService = {
    getCompany: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return;
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const idToFetch = call.request.company_id;
            connection.query('SELECT * FROM company WHERE id = ?', [idToFetch], function(err, results, fields) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                if (results.length === 0) {
                   console.log('No record found with ID ' + idToFetch);
                } else {
                    console.log('Query results: ', results[0]);
                    const company =  results[0];
                    callback(null, { company });
                }  
            });
        });
    },

    searchCompanies: (call, callback) => {
        const { query } = call.request;
        try {
            connection.connect(function(err) {
                if (err) {
                    console.error('Error connecting to MySQL database: ' + err.stack);
                    return;
                }
                console.log('Connected to MySQL database as id ' + connection.threadId);
                connection.query('SELECT * FROM company', function(err, results, fields) {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    const companies = results;
                    callback(null, { companies });
            });
        });
        } catch (error) {}
    },

    deleteCompany: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return callback(err, null); 
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const idToDelete = call.request.company_id;
            connection.query('DELETE FROM company WHERE id = ?', [idToDelete], function(err, results, fields) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    callback(err, null); 
                }
                if (results.affectedRows === 0) {
                    console.log('No record found with ID ' + idToDelete);
                    callback(null, {success:false});
                } else {
                    console.log('Company deleted successfully');
                    callback(null, {success:true});
                }
            });
        });
    },

    addCompany: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return;
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const name = call.request.name;
            const location = call.request.location;
            connection.query("INSERT INTO company (`id`, `name`, `location`) VALUES (null, ?, ?)", [name, location], function(err, results, fields) {
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
                        connection.query('SELECT * FROM company WHERE id = ?', [idToFetch], function(err, results, fields) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            if (results.length === 0) {
                                console.log('No record found with ID ' + idToFetch);
                            } else {
                                console.log('Query results: ', results[0]);
                                const company =  results[0];
                                callback(null, { company });
                            } 
                        });
                    });
                }
            });
        });
    },

    updateCompany: (call, callback) => {
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
                return;
            }
            console.log('Connected to MySQL database as id ' + connection.threadId);
            const id = call.request.id;
            const name = call.request.name;
            const location = call.request.location;
            connection.query("UPDATE `company` SET `name` = ?, `location` = ? WHERE `company`.`id` = ?;", [name, location,id], function(err, results, fields) {
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
                        connection.query('SELECT * FROM company WHERE id = ?', [idToFetch], function(err, results, fields) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            if (results.length === 0) {
                                console.log('No record found with ID ' + idToFetch);
                            } else {
                                console.log('Query results: ', results[0]);
                                const company =  results[0];
                                callback(null, { company });
                            }  
                        });
                    });
                }
            });
        });
    }

};

const server = new grpc.Server();
server.addService(companyProto.CompanyService.service, companyService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),(err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});
console.log(`Microservice de company en cours d'exécution sur le port ${port}`);