//Declaración de express
const express = require('express');

//Importación de Modulo de Servicios Mails
const service_mail = require('./servicios-mail');

//Declaración del Servidor
const servidor = express();

//Importador de politicas de CORS
const cors = require('cors');
3
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

const serverNode = servidor.listen(process.env.port || 5000);

//Mensaje de uso para programadores
console.log(`Servidor corriendo en el puerto: http://localhost:${serverNode.address().port}`);