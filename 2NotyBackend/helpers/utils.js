//Requerimos el paquete
var nodemailer = require("nodemailer");
require("dotenv").config();


const SendEmail = async (name,email,token) => {
  //Creamos el objeto de transporte
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mensaje = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8" />
      <title>Activación de Cuenta</title>
  </head>
  <body>
      <p>Estimado ${name} favor de ingresar a esta liga para poder finalizar su registro <a href="http://3.136.19.219/${token}">Url de activacion</a></p>
  
  </body>
  </html>`;
try {
    let info = await transporter.sendMail({
        from: "soluciones@tresw.mx",
        to: email,
        subject: "Activación de 2Noty",
        html: mensaje,
      });
      console.log('Email enviado: ' + info.response);
} catch (error) {
    console.log('error: ' + error);
}


};

module.exports = { SendEmail };
