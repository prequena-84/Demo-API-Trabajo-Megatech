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
        const codigo = req.body.codigo;
        let objSalida = [] ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer)
        ]);

        //validar estado de la conexion
        //console.log(conexion);

        //Establecer la consulta
        const consulta = await sql.query(`SELECT CODRUB, DESCRIPCION FROM dbo.RUBROS where CODRUB LIKE '%${codigo}%'`);

        //Cerrar conexion
        await sql.close();
        //console.log("Cierre de la conexion SQL");

        //res.json(consulta1.recordset);
        consulta.recordset.map(item => {
            objSalida.push({
                codigo:item.CODRUB.trim(),
                rubro:item.DESCRIPCION.trim()
            });
        });

        console.log(objSalida);

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

router.post("/SQL-BuscarRubrodes", async (req,res) => {
    try {
        const descripcion = req.body.descripcion;
        let objSalida = [] ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer)
        ]);

        //validar estado de la conexion
        //console.log(conexion);

        //Establecer la consulta
        const consulta = await sql.query(`SELECT CODRUB, DESCRIPCION FROM dbo.RUBROS where DESCRIPCION LIKE '%${descripcion}%'`);
        
        //Cerrar conexion
        await sql.close();
        //console.log("Cierre de la conexion SQL");

        //res.json(consulta1.recordset);
        consulta.recordset.map(item => {
            objSalida.push({
                codigo:item.CODRUB.trim(),
                rubro:item.DESCRIPCION.trim()
            });
        });

        console.log(objSalida);

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

    const 
        codigo = req.body.codigo,
        descripcion = req.body.descripcion,
        operacion = req.body.operacion // Tipo de Operación "A", "U" o "D"
    ;

    //Establecer conexión
    const conexion = await Promise.all([
        sql.connect(configSQLServer)
    ]);

    /*
    //validar estado de la conexion
    //console.log(conexion);

    //Establecer la consulta
    //const consulta1 = await sql.query(`SELECT DESCRIPCION FROM dbo.RUBROS where CODRUB LIKE '%${codigo}%'`)

    //Ejemplo Para Agregar una Funcion:
    //const result = await sql.query(`SELECT dbo.dbfn_Suma (4,8 ) rESULTADO`);
    */
    //Ejemplo de Procedimiento Almacenado:
    const sentencia = await sql.query(`EXECUTE ROTOPLAS.dbo.InsertarRubro '${codigo}', '${descripcion}', '${operacion}'`);

    //Resultado de la Consulta
    //console.log(sentencia);

    //Cerrar conexion
    await sql.close();
    console.log("Cierre de la conexion SQL");

    //res.json(consulta1.recordset);
    console.log(sentencia.recordset);

});


module.exports = router;