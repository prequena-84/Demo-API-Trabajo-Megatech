//Proyecto en GitHub debe correr en el puerto 3000
//Declaración de express
const express = require('express');

//Importador 
const path = require('path');

//Importador de variables de Entornos
require('dotenv').config({ path: path.resolve(__dirname,'./.env.dev') });

//Importación de Modulo de Servicios Mails
const service_mail = require('./api/servicios-mail');

//Importación de Modulo de Sql-1
const service_SQL = require('./api/Servicio-SQL');

//Declaración del Servidor
const servidor = express();

//Importador de politicas de CORS
const cors = require('cors');

//Configuración del servidor
servidor.all('/',(req,res, next) => {
    try {
        res.send('Bienvenido a la API de servicios de Rotoplas');
    } catch(err) {
        next(err);
    }
});

servidor.use(cors());
servidor.use('/API-Mail', service_mail);
servidor.use('/API-Sql', service_SQL);

servidor.listen( process.env.port || process.env.PORT);
