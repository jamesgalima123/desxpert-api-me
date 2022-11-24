exports.mysql = async () => {
    
    var mysql = require('mysql2');
    var env = process.env;
       
    return await mysql.createConnection({
        host:                 env.DB_HOST,
        user:                 env.DB_USERNAME,
        password:             env.DB_PASSWORD,
        database:             env.DB_DATABASE,
        connectTimeout:       60000,
        multipleStatements:   true        
    });        
}
