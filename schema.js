const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
type Company {
    id: String
    name: String!
    location: String!
}

type Product {
    id: String
    idcompany: String!
    name: String!
}

type Query {
    product(id:String!):Product
    products:[Product]
    company(id: String!): Company
    companies: [Company]

}
type Mutation{
    deleteProduct(id:String!):DeleteProductResponse!
    addProduct(idcompany:String!,name:String!):Product!
    updateProduct(id:String!,idcompany:String!,name:String!):Product!
    deleteCompany(id:String!):DeleteCompanyResponse!
    addCompany(name:String!,location:String!):Company!
    updateCompany(id:String!,name:String!,location:String!):Company!
}
type DeleteCompanyResponse {
    success: Boolean!
} 
type DeleteProductResponse {
    success: Boolean!
} 
`;
module.exports = typeDefs