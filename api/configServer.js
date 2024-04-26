const configSQL = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    synchronize: true,
    trustServerCertificate: true,
    option : {
        port: 1433,
        encrypt: false,
        instancename: process.env.instancename,
        //integratedSecurity: true
    }
};

module.exports = configSQL