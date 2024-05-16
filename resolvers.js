const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const companyProtoPath = 'company.proto';
const productProtoPath = 'product.proto'

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

const resolvers = {
    Query: {
        company: (_, { id }) => {
            const client = new companyProto.CompanyService('localhost:50051',grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getCompany({ company_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.company);
                    }
                });
            });
        },
        companies: () => {
            const client = new companyProto.CompanyService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchCompanies({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.companies);
                    }
                });
            });
        },

        product: (_, { id }) => {
            const client = new productProto.ProductService('localhost:50052',grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getProduct({ product_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.product);
                    }
                });
            });
        },
        products: () => {
            const client = new productProto.ProductService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchProducts({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.products);
                    }
                });
            });
        },
    },
    Mutation: {
        deleteCompany: (_, { id }) => {
            const client = new companyProto.CompanyService('localhost:50051',grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                    client.deleteCompany({ company_id: id }, (error, response) => {
                        if (error) {
                            reject(error); 
                        } else {
                            if (response) {
                                resolve(response); 
                            } else {
                                console.log('Failed to delete company');
                                reject('Failed to delete company'); 
                            }
                        }
                    });
                });
            },

        addCompany: (_, { name, location }) => {
            const client = new companyProto.CompanyService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.addCompany({ name: name, location: location }, (error, response) => {
                    if (error) {
                        reject(error); 
                    } else {
                        if (response && response.company) {
                            resolve(response.company); 
                        } else {
                            console.log('Failed to add company');
                            reject('Failed to add company'); 
                        }
                    }
                });
            });
        },

        updateCompany: (_, { id,name, location }) => {
            const client = new companyProto.CompanyService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.updateCompany({ id:id,name: name, location: location }, (error, response) => {
                    if (error) {
                        reject(error); 
                    } else {
                        if (response && response.company) {
                            resolve(response.company); 
                        } else {
                            console.log('Failed to update company');
                            reject('Failed to update company'); 
                        }
                    }
                });
            });
        },

        deleteProduct: (_, { id }) => {
            const client = new productProto.ProductService('localhost:50052',grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                    client.deleteProduct({ product_id: id }, (error, response) => {
                        if (error) {
                            reject(error); 
                        } else {
                            if (response) {
                                resolve(response); 
                            } else {
                                console.log('Failed to delete product');
                                reject('Failed to delete product'); 
                            }
                        }
                    });
                });
            },

        addProduct: (_, { idcompany, name }) => {
            const client = new productProto.ProductService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.addProduct({ idcompany:idcompany,name: name }, (error, response) => {
                    if (error) {
                        reject(error); 
                    } else {
                        if (response && response.product) {
                            resolve(response.product); 
                        } else {
                            console.log('Failed to add product');
                            reject('Failed to add product'); 
                        }
                    }
                });
            });
        },

        updateProduct: (_, { id,idcompany, name }) => {
            const client = new productProto.ProductService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.updateProduct({ id:id,idcompany:idcompany,name: name }, (error, response) => {
                    if (error) {
                        reject(error); 
                    } else {
                        if (response && response.product) {
                            resolve(response.product); 
                        } else {
                            console.log('Failed to update product');
                            reject('Failed to update product'); 
                        }
                    }
                });
            });
        }
    },
};
module.exports = resolvers;