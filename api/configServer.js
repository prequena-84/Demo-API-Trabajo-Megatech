const configSQL = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    synchronize: process.env.synchronize,
    trustServerCertificate: process.env.trustServerCertificate,
    option : {
        port: process.env.port,
        encrypt: process.env.encrypt,
        instancename: process.env.instancename,
    }
};

console.log(configSQL);

module.exports = configSQL