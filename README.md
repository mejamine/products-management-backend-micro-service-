so to test this project all you need to do before downloding it is having node js installed in your laptop and xamp so you can create a phpMyAdmin data base 
run you apache server and your sql server through xamp
go to phpMyAdmin and create a database named dbmicroservice
in this dtabase create the table company with id(auto increment), name, location as attributes
create an other table named product with id(auto increment),idcompany, name as attribute
if you did all of this just download the app and oper you code editor
opern three terminals and execute these command one after an other 
node companyMicroservice.js
node productMicroservice.js
node apiGateway.js
nox ypu can test the functions through grqphQL requests in any navigator after typing the following link to open appolo server : localhost:3000
or you can test them through rest api in PostMan for example
if there's any problem or a suggestion i'm open for anything just contact me through my email : mejbria9@gmail.com
