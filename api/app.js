//Proyecto en GitHub debe correr en el puerto 3000
//Declaración de express
const express = require('express');

//Importación de Modulo de Servicios Mails
const service_mail = require('./servicios-mail');

//Importación de Modulo de Sql-1
const service_mail = require('./Servicio-SQL1');

//Declaración del Servidor
const servidor = express();

//Importador de politicas de CORS
const cors = require('cors');

//Importador 
const path = require('path');

//Importador de variables de Entornos
require('dotenv').config({ path: path.resolve(__dirname,'../.env.dev') });

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
servidor.use('/API-Sql', service_mail);

const serverNode = servidor.listen(process.env.port || 3000);

//Mensaje de uso para programadores
console.log(`Servidor corriendo en el puerto: http://localhost:${serverNode.address().port}`);