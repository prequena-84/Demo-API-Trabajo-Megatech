//Importación de Express
const express = require('express');

//Declaración de la ruta
const router = express.Router();

//Importación de librerias
const bodyParse = require('body-parser');

//Importación de la Libreria que envia Mails
const nodemailer = require('nodemailer');

//Configuración del uso del Body
router.use(bodyParse.json());

//Configuración Metodo Get para la prueba del funcionamiento de la API
router.get("/", (req,res) => {
    try {
        res.status(200).send({
            mensaje: "API de Servicio Envio de Mails"
        });

    }catch(err){
        res.status(500).send({
            mensaje: "Error en Servicio Envio de Mails"
        });
    };
});

//Configuración del Metodo POST para el envio de la Petición de la API
router.post("/sendMail", (req,res) => {
    try {

        const datos = req.body;

        //Se crea un transportador SMTP con la configuración para Outlook 365/hotmail/google y yahoo    
        let transporter = nodemailer.createTransport({
            host: datos.hosting,          //Servidor- string
            port: datos.puerto,           //Puerto  - integer
            secure: datos.seguridad,      //secure  - boolean
            auth: {
                user: datos.usuario,      //usuario - string
                pass: datos.clave         //password- string
            },
            tls: {
                ciphers: datos.protocolo  //Protocolo- string
            }
        });

        //Configuración de los detalles del correo electrónico
        let mailOptions = {
            from: datos.usuario,                    //correo electrónico remitente    - string
            name: datos.nombreRemitente,            //Nombre del remitente            - string
            to: datos.mailDestinatario,             //correo electrónico destinatario - string
            name: datos.nombreDestinatario,         //Nombre del destinatario         - string
            cc: (datos.cc.length >= 1) ? datos.cc : null, //Copia de Destinario - string
            subject: datos.asunto,                  //Asunto del correo               - string
            html: datos.cuerpo,                    //Cuerpo del correo en HTML       - string
            attachments:datos.attachments                       
        };

        //Envio del Mail
        transporter.sendMail(mailOptions, (errMensaje,info) => {
            try {
                res.status(200).json({
                    mensaje: `Envio de mail:${info.messageId}`,
                    recibido: datos,
                });
                //console.log('enviado');
            } catch(err) {
                res.status(500).json({
                    mensaje: `Error en Envio:${errMensaje.message}`,
                    recibido: datos,
                });
                //console.error(`Error Función sendMail: ${err}`,errMensaje.message);
            };
        });

    } catch(err) {
        //console.warn(`error: ${err}`);
        res.status(500).json({
            ok:false,
            mensaje:`Error en la petición: ${err}`
        });
    };
});

module.exports = router;