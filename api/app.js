//Proyecto en GitHub debe correr en el puerto 3000
//Declaración de express
const express = require('express');

//Importador 
const path = require('path');

//Importador de variables de Entornos
require('dotenv').config({ path: path.resolve(__dirname,'../.env.dev') });

//Importación de Modulo de Servicios Mails
const service_mail = require('./servicios-mail');

//Importación de Modulo de Sql-1
const service_SQL = require('./Servicio-SQL');

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

const serverNode = servidor.listen(process.env.port || 3000);

console.log(`Servidor corriendo en: http://${serverNode.address().address}:${serverNode.address().port}`);