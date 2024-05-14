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
        let 
            codigo = req.body.codigo,
            descripcion = req.body.descripcion,
            operacion = req.body.operacion, // Tipo de Operación "A", "U" o "D"
            categoriaAnterior,
            categoriaEncontrada
        ;

        //Establecer conexión
        const conexion = await Promise.all([
            sql.connect(configSQLServer)
        ]);


        //Validador para manejo de categorias ya existentes en la base de datos
        if ( operacion == 'A' ) {
            categoriaEncontrada = await sql.query(`select DESCRIPCION from RUBROS WHERE CODRUB = '${codigo}';`);
            if ( categoriaEncontrada.recordset.length > 0 ) {
                //respuesta
                res.send(`La Categoria: "${descripcion}" ya existe en la base de datos`);
                  //Cerrar conexion
                await sql.close();
                return;
            };
        };

        //Lectura de Categoria Anterior
        categoriaAnterior = operacion == 'U' ? await sql.query(`select DESCRIPCION from RUBROS WHERE CODRUB = '${codigo}';`) : '' ;

        //Ejemplo de Procedimiento Almacenado:
        await sql.query(`EXECUTE ROTOPLAS_UAT.dbo.InsertarRubro ${ codigo !== '' ? "'" + codigo + "'" : null }, '${descripcion}', '${operacion}'`);

        //Cerrar conexion
        await sql.close();

         // Returno de la Respuesta con Status 200
         res.status(200).send(`${respuestOperacion(operacion == 'U' ? `"${categoriaAnterior.recordsets[0][0].DESCRIPCION.trim()}"` : '')} la Categoria: "${descripcion}" ${ codigo !== '' ? ', con el código: "' + codigo + '"' : '' } sastifactoriamente `);
        
         function respuestOperacion(catAnt) {
            if( operacion == 'A' ) {
                return 'se ha dado de alta ';
            } else if ( operacion == 'U' ) {
                return `se ha modificado la categoria ${catAnt} por la`;
            } else if ( operacion == 'D' ) {
                return 'se ha Eliminado ';
            };
        };

    // Controlador de Errores
    } catch(err) {
        console.log(err)
        res.send(`No se logro realizar la operación por un error, por favor revise los datos ingresado en el formulario como los caracter especiales "*", "/", "\'", "\""`);
    };
});

module.exports = router;