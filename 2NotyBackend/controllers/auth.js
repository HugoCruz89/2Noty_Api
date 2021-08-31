const { response } = require("express");
// const {Pool} = require('pg')
const { pool } = require("./../dbCongif");
const bcrypt = require("bcrypt");
const { getDateNow } = require("./../helpers/helpers");
// const pool=  new Pool({
//     host:'notydb.c2rkujiggjuq.us-east-2.rds.amazonaws.com',
//     user:'postgres',
//     password:'Br4sil24.',
//     database:'notydb',
//     port:'5432'
// })

const getUsers = async (req, res = response) => {
  let error = "";

  const response = await pool.query(
    "INSERT INTO estatus(id_estatus, estatus)VALUES(2, 'inactivo')",
    (err, res) => {
      console.log("errors", err.detail);
      console.log("respuesta", res);
      error = err.detail;

      pool.end();
    }
  );
  // const response= await pool.query("DELETE FROM estatus",(err, res) => {
  //   console.log('errors',err);
  //   console.log('respuesta',res)
  //   pool.end();
  // });
  // console.log(response.rows)
  if (error === "") {
    res.status(400).json({
      ok: false,
      msg: error,
    });
  } else {
    res.status(201).json({
      ok: true,
      msg: "registroAceptado",
    });
  }
};

const register = async (req, res = response) => {
  const { name, email, password, password2, idEstado, idPais } = req.body;
  let errors = [];

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
          [idPais, idEstado, name, email, hashedPassword, getDateNow(), 1]
        )
        .then((response) => {
          client.release();
          res.status(201).json({
            ok: true,
            msg: response.command,
          });
        })
        .catch((err) => {
          client.release();
          res.status(400).json({
            ok: false,
            msg: err,
          });
        });
    });
  }
};

const loginUsuario = (req, res = response) => {
  const { email, password } = req.body;

  pool.query(
    `SELECT * FROM usuarios where correo= $1`,[email],(err, results)=>{
      if (err) {
        throw err
      }
      console.log(results.rows)
      if (results.rows.length>0) {

        const user = results.rows[0]
        bcrypt.compare(password,user.password,(err, isMatch)=>{
          if (err) {
            throw err
          }
          if (isMatch) {
            res.status(200).json({
              ok: true,
              user: user,
            });
          }
        })
      }else{
        res.status(401).json({
          ok: false,
          msg: "Correo no entoncontrado",
        });
      }
    }
  )
};

const revalidarToken = (req, res = response) => {
  res.json({
    ok: true,
    msg: "renew",
  });
};

module.exports = { getUsers, register, loginUsuario, revalidarToken };
