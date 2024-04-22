const express = require('express');
const sql = require('mssql');

const router = express.Router();

const configSQLServer = require('./configServer')

const bodyParse = require('body-parser');
router.use(bodyParse.json());

//Configuración Metodo Get para la prueba del funcionamiento de la API
router.get("/", (req,res) => {
    try {
        res.status(200).send({
            mensaje: "API de Servicio Sql-1"
        });

    }catch(err){
        res.status(500).send({
            mensaje: "Error en Servicio Sql-1"
        });
    };
});

router.get("/Servicio-ABMCategorias", async (req,res) => {

    const 
        codigo = '001',
        categoria = 'TAN Tanque de Agua',
        accion = 'A' // "A", "U" o "D"
    ;

    //Establecer conexión
    // await sql.connect(configSQLServer);
    
    //Establecer la consulta
    
    



});


module.exports = router;