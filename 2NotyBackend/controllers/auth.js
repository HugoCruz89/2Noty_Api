const { response } = require("express");

const { pool } = require("./../dbCongif");
const bcrypt = require("bcrypt");
const { getDateNow } = require("./../helpers/helpers");
const { SendEmail } = require("./../helpers/utils")
const jwt = require("jsonwebtoken");
const config = require("./../configs/config");

const getUsers = async (req, res = response) => {
  const token = req.headers["access-token"];

  if (token) {
    jwt.verify(token, config.llave, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          msg: "Token inválida",
        });
      } else {
        //  req.decoded = decoded;
        //  console.log("req.decoded", req.decoded);
        pool.query(`SELECT * FROM usuarios`, (err, results) => {
          if (err) {
            throw err;
          }
          res.status(200).json({
            ok: true,
            users: results.rows,
          });
        });
      }
    });
  } else {
    res.status(400).json({
      ok: false,
      msg: "Token no proveída.",
    });
  }
};

const register = async (req, res = response) => {
  const { name, email, password, password2, idEstado, idPais } = req.body;
  let data = {
    name: name,
    email: email
  }
  let errors = [];
  const token = jwt.sign(data, config.llave, {
    expiresIn: '24h',
  });
  const subject = 'Activación de 2NotyActivación de Cuenta';
  const title = 'Activación de Cuenta';
  const body = `<p>Estimado ${name} favor de ingresar a esta liga para poder finalizar su registro <a href="http://3.136.19.219/uservalidate.html?obCode=${token}">Url de activacion</a></p>`
  
  

  if (password !== password2) {
    errors.push({
      msg: {
        password: {
          value: password2,
          msg: "las contraseñas deben ser iguales",
          param: "password2",
          location: "body",
        },
      },
    });
  }
  if (errors.length > 0) {
    res.status(400).json({
      errors,
    });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    pool.connect().then((client) => {
      return client
        .query(
          `INSERT INTO usuarios(id_Pais, id_Estado,nombre,correo,password,fecha_registro,id_estatus)
                     VALUES($1,$2,$3,$4,$5,$6,$7)`,
          [idPais, idEstado, name, email, hashedPassword, getDateNow(), 3]
        )
        .then((response) => {
          client.release();
          SendEmail(body, email, title, subject)
          res.status(201).json({
            ok: true,
            msg: response.command,
          });
        })
        .catch((err) => {
          client.release();
          res.status(200).json({
            ok: false,
            msg: err,
          });
        });
    });
  }
};


const login = (req, res = response) => {
  const { email, password } = req.body;

  pool.query(
    `SELECT * FROM usuarios where correo= $1`,
    [email],
    (err, results) => {
      if (err) {
        throw err;
      }

      if (results.rows.length > 0) {
        const user = results.rows[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            const token = jwt.sign(user, config.llave, {
              expiresIn: 1440,
            });
            res.status(200).json({
              ok: true,
              _token: token,
              msg: "Autenticación correcta",
            });
          } else {
            res.status(400).json({
              ok: false,
              msg: "Autenticación Incorrecta",
              _token: null,
            });
          }
        });
      } else {
        res.status(400).json({
          ok: false,
          msg: "Correo no entoncontrado",
        });
      }
    }
  );
};

const revalidarToken = (req, res = response) => {
  res.json({
    ok: true,
    msg: "renew",
  });
};

const userValidate = (req, res = response) => {
  const token = req.params.jwt;
  if (token) {
    jwt.verify(token, config.llave, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          msg: "Token inválida",
        });
      } else {
        const { email } = decoded;
        const upperCorreo = email.toUpperCase()
        pool.query(`SELECT * FROM usuarios WHERE UPPER(correo)='${upperCorreo}'`, (err, results) => {
          if (err) {
            throw err;
          }
          const idUser = results.rows[0].id_usuario;
          pool.query(`UPDATE usuarios SET id_estatus=1 WHERE id_usuario=${idUser}`, (err, results) => {
            if (err) {
              throw err;
            }
            res.status(200).json({
              ok: true,
              msg: "Usuario validado!"
            });
          });

        });
      }
    });
  } else {
    res.status(400).json({
      ok: false,
      msg: "Token no proveída.",
    });
  }
};

const emailResetPassword = (req, res = response) => {
  const { body, email } = req.body;
  SendEmail(body, email, 'Cambia tu contraseña', 'Cambia tu contraseña')
   res.status(200).json({
     ok:true,
     msg:"Se envio correo"
   });
}

module.exports = { getUsers, register, login, revalidarToken, userValidate, emailResetPassword };
