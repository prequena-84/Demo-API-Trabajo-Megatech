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

//Quede en agregar los controladores de errores
//Y hacer la peticiòn para modificar, dar de alta o Eliminar el rubro
router.post("/SQL-BuscarRubrocod", async (req,res) => {
    try {
        const codigo = req.body.codigo ;
        let objSalida = [] ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer)
        ]);
        //Establecer la consulta
        const consulta = await sql.query(`SELECT CODRUB, DESCRIPCION FROM dbo.RUBROS where CODRUB LIKE '%${codigo}%'`);

        //Cerrar conexion
        await sql.close();

        //res.json(consulta1.recordset);
        consulta.recordset.map(item => {
            objSalida.push({
                codigo:item.CODRUB.trim(),
                rubro:item.DESCRIPCION.trim()
            });
        });

        res.status(200).json({
            ok:true,
            recibido:objSalida	
        });

    } catch(err) {
        //console.log(err);
        res.status(500).json({
            ok:false,
            mensaje:`Error en la busqueda: ${err}`
        });
    };
});

router.post("/SQL-BuscarRubrodes", async (req,res) => {
    try {
        const descripcion = req.body.descripcion;
        let objSalida = [] ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer)
        ]);

        //Establecer la consulta
        const consulta = await sql.query(`SELECT CODRUB, DESCRIPCION FROM dbo.RUBROS where DESCRIPCION LIKE '%${descripcion}%'`);
        
        //Cerrar conexion
        await sql.close();

        //res.json(consulta1.recordset);
        consulta.recordset.map(item => {
            objSalida.push({
                codigo:item.CODRUB.trim(),
                rubro:item.DESCRIPCION.trim()
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

router.post("/SQL-OperaionABMCategorias", async (req,res) => {
    try {
        const 
            codigo = req.body.codigo,
            descripcion = req.body.descripcion,
            operacion = req.body.operacion, // Tipo de Operación "A", "U" o "D"
            respuestOperacion = () => {
                if( operacion == 'A' ) {
                    return 'se ha dado de alta '
                } else if ( operacion == 'U' ) {
                    return 'se ha modificado '
                } else if ( operacion == 'D' ) {
                    return 'se ha Eliminado '
                };
            };
        ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer)
        ]);

        //Ejemplo de Procedimiento Almacenado:
        await sql.query(`EXECUTE ROTOPLAS_UAT.dbo.InsertarRubro ${ codigo !== '' ? "'" + codigo + "'" : null }, '${descripcion}', '${operacion}'`);

        //Cerrar conexion
        await sql.close();

        // Returno de la Respuesta con Status 200
        res.status(200).send(`${respuestOperacion()} la Categoria: "${descripcion}" ${ codigo !== '' ? ', con el código: "' + codigo + '"' : '' } sastifactoriamente `);
        
    // Controlador de Errores
    } catch(err) {
        //console.log(err);
        res.status(500).send(`No se logro realizar la operación por el siguiente Error: ${err}`);
    };
});

module.exports = router;