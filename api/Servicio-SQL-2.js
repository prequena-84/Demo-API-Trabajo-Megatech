const express = require('express');
const sql = require('mssql');
const router = express.Router();
const configSQLServer1 = require('./configServer-1')
const configSQLServer2 = require('./configServer-2')
const bodyParse = require('body-parser');
router.use(bodyParse.json());

//Configuración Metodo Get para la prueba del funcionamiento de la API
router.get("/", (req,res) => {
    try {
        res.status(200).send({
            mensaje: "API de Servicio Sql-2"
        });

    }catch(err){
        res.status(500).send({
            mensaje: "Error en Servicio Sql-2"
        });
    };
});

// BUSCAR Marca POR CÓDIGO
router.post("/SQL-BuscarMarcaCod", async (req,res) => {
    try {
        const codigo = req.body.codigo ;
        let objSalida = [] ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer2)
        ]);

        //Establecer la consulta
        const consulta = await sql.query(`SELECT MarcaId, Nombre from ViewMarca where MarcaId LIKE '%${codigo}%'`);

        //Cerrar conexion
        await sql.close();

        //res.json(consulta1.recordset);
        consulta.recordset.map(item => {
            objSalida.push({
                codigo:item.MarcaId.trim(),
                rubro:item.Nombre.trim()
            });
        });

        res.status(200).json({
            ok:true,
            recibido:objSalida	
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            ok:false,
            mensaje:`Error en la busqueda: ${err}`
        });
    };
});

// BUSCAR Marca POR Descripción
router.post("/SQL-BuscarMarcaDes", async (req,res) => {
    try {
        const descripcion = req.body.descripcion;
        let objSalida = [] ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer2)
        ]);

        //Establecer la consulta
        const consulta = await sql.query(`SELECT MarcaId, Nombre from ViewMarca where Nombre LIKE '%${descripcion}%'`);
        
        //Cerrar conexion
        await sql.close();

        //res.json(consulta1.recordset);
        consulta.recordset.map(item => {
            objSalida.push({
                codigo:item.MarcaId.trim(),
                rubro:item.Nombre.trim()
            });
        });

        res.status(200).json({
            ok:true,
            recibido:objSalida	
        });

    } catch(err) {
        res.status(500).json({
            ok:false,
            mensaje:`Error en la busqueda: ${err}`
        });
    };
});

// Procedimiento Almacenado de Registro
router.post("/SQL-RegistroMarca", async (req,res) => {
    try {

        if (req.body.desMar == null || req.body.desMar == '' ) {
            res.status(200).send('Debe agregar valores en el campo del Nombre de la Marca que desea Agregar');
            return;
        }
        // Declaracion de varaible que contiene la conexión pool
        let pool = null;

        // Ejecución de la Función que conecta la BD
        pool = await conectarBD(configSQLServer1);

        // Definimos un nuevo objecto Request SQL Server
        let sqlRequest = new sql.Request(pool); 
        
        // Asigno el valor de ingreso
        sqlRequest.input('codAtributo', sql.VarChar, req.body.codAtr);
        sqlRequest.input('codMarca', sql.VarChar, req.body.codMar || null);
        sqlRequest.input('descripcionMarca', sql.VarChar, req.body.desMar);

        // Asigno el Valor de Salida
        sqlRequest.output('txtSalida', sql.VarChar);

        // Ejecución Procedimiento Almacenado con conexión pool
        const response = await sqlRequest.execute('ROTOPLAS.dbo.InsertarMarca');    

         // Returno de la Respuesta con Status 200
         res.status(200).send(response.output.txtSalida);

         async function conectarBD(configBD) {
            try {
                let pool = await sql.connect(configBD);
                return pool;
            } catch(err) {
                console.log(err);
            };
         };
        
    // Controlador de Errores
    } catch(err) {
        console.log(err)
        res.send(`No se logro realizar la operación por un error, por favor revise los datos ingresado en el formulario como los caracter especiales "*", "/", "\'", "\""`);
    } finally {
        sql.close();
    };
});

// Procedimiento Almacenado de Modificación
router.post("/SQL-ModificarMarca", async (req,res) => {
    try {
        // Declaracion de varaible que contiene la conexión pool
        let pool = null;

        if (req.body.codMar == null || req.body.codMar == '') {
            res.status(200).send('Debe agregar valores en el campo de Id de la Marca y/o el Nombre de la Marca que desea modificar');
            return;
        };

        // Ejecución de la Función que conecta la BD
        pool = await conectarBD(configSQLServer1);

        // Definimos un nuevo objecto Request SQL Server
        let sqlRequest = new sql.Request(pool); 
        
        // Asigno el valor de ingreso
        sqlRequest.input('codAtributo', sql.VarChar, req.body.codAtr);
        sqlRequest.input('codMarca', sql.VarChar, req.body.codMar);
        sqlRequest.input('descripcionMarca', sql.VarChar, req.body.desMar);

        // Asigno el Valor de Salida
        sqlRequest.output('txtSalida', sql.VarChar);

        // Ejecución Procedimiento Almacenado con conexión pool
        const response = await sqlRequest.execute('ROTOPLAS.dbo.ModificarMarca');    

         // Returno de la Respuesta con Status 200
         res.status(200).send(response.output.txtSalida);

         async function conectarBD(configBD) {
            try {
                let pool = await sql.connect(configBD);
                return pool;
            } catch(err) {
                console.log(err);
            };
         };
        
    // Controlador de Errores
    } catch(err) {
        console.log(err)
        res.send(`No se logro realizar la operación por un error, por favor revise los datos ingresado en el formulario como los caracter especiales "*", "/", "\'", "\""`);
    } finally {
        sql.close();
    };
});

// Procedimiento Almacenado de Eliminación
router.post("/SQL-EliminarMarca", async (req,res) => {
    try {
        // Declaracion de varaible que contiene la conexión pool
        let pool = null;

        if (req.body.codMar == null || req.body.codMar == '') {
            res.status(200).send('Debe agregar valores en el campo de Id de la Marca y/o el Nombre de la Marca que desea eliminar');
            return;
        };

        // Ejecución de la Función que conecta la BD
        pool = await conectarBD(configSQLServer1);

        // Definimos un nuevo objecto Request SQL Server
        let sqlRequest = new sql.Request(pool); 
        
        // Asigno el valor de ingreso
        sqlRequest.input('codAtributo', sql.VarChar, req.body.codAtr);
        sqlRequest.input('codMarca', sql.VarChar, req.body.codMar);

        // Asigno el Valor de Salida
        sqlRequest.output('txtSalida', sql.VarChar);

        // Ejecución Procedimiento Almacenado con conexión pool
        const response = await sqlRequest.execute('ROTOPLAS.dbo.EliminarMarca');    

         // Returno de la Respuesta con Status 200
         res.status(200).send(response.output.txtSalida);

         async function conectarBD(configBD) {
            try {
                let pool = await sql.connect(configBD);
                return pool;
            } catch(err) {
                console.log(err);
            };
         };
        
    // Controlador de Errores
    } catch(err) {
        console.log(err)
        res.send(`No se logro realizar la operación por un error, por favor revise los datos ingresado en el formulario como los caracter especiales "*", "/", "\'", "\""`);
    } finally {
        sql.close();
    };
});

// Exportación del Modulo
module.exports = router;