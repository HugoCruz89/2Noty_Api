//Requerimos el paquete
var nodemailer = require("nodemailer");
require("dotenv").config();
const multer = require('multer')

const SendEmail = async (body, email, title, subject) => {
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
      <title>${title}</title>
  </head>
  <body>
      
  ${body}

  </body>
  </html>`;
  try {
    let info = await transporter.sendMail({
      from: "soluciones@tresw.mx",
      to: email,
      subject,
      html: mensaje,
    });
    console.log('Email enviado: ' + info.response);
  } catch (error) {
    console.log('error: ' + error);
  }


};

const saveFile = async () => {
  const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '/suscripcion'),
    filename: (req, files, cb) => {
      cb(null, `${Date.now()}-${files.originalname}`)
    }
  })
  const fileUpload = multer({
    storage: diskStorage
  }).single('image')
  console.log(fileUpload)
  
}

module.exports = { SendEmail };
