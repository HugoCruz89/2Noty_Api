const { pool } = require("./../dbCongif");
const bcrypt = require("bcrypt");
const { getDateNow } = require("./../helpers/helpers");
var fs = require('fs');

const getUser = async (req, res = response) => {
  const idUsuario = req.params.id;
  const aux = (idUsuario === 'undefined' || idUsuario === '{id}') ? '' : `AND u.id_usuario=${idUsuario}`;
  pool.connect().then((client) => {
    return client
      .query(
        `select u.id_usuario, u.nombre,u.correo,to_char(u.fecha_registro,'DD/MM/YYYY')as fecha_registro,p.id_pais,p.pais,ep.id_estado,ep.estado_provincia,e.id_estatus,e.estatus,pr.id_perfil,pr.perfil, u.image, u.id_empresa
        from usuarios u,paises p, estados_provincias ep,estatus e,perfiles pr
        where u.id_pais=p.id_pais and u.id_estado=ep.id_estado and u.id_estatus=e.id_estatus and u.id_perfil=pr.id_perfil ${aux}
        order by 1;`
      )
      .then((response) => {
        client.release();
        res.status(200).json({
          ok: true,
          data: response.rows,
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
};

const postUser = async (req, res = response) => {
  const {
    nombre,
    correo,
    password,
    id_estatus,
    id_estado,
    id_pais,
    id_perfil,
    id_empresa
  } = req.body;

  let hashedPassword = await bcrypt.hash(password, 10);
  const emailUpperCase = correo.toUpperCase();
  let image;

  if (req.files) {
    image = `data:${req.files.image.mimetype};base64,${req.files.image.data.toString('base64')}`;
  }
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM usuarios WHERE upper(correo)=$1`, [emailUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra registrado el correo",
          });
        } else {
          return client
            .query(
              `INSERT INTO usuarios( id_pais, id_estado, nombre, correo, password, fecha_registro, id_estatus, id_perfil, image, id_empresa)
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
              [
                id_pais,
                id_estado,
                nombre,
                correo,
                hashedPassword,
                getDateNow(),
                id_estatus,
                id_perfil,
                image,
                id_empresa
              ]
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
        }
      })
      .catch((err) => {
        client.release();
        res.status(400).json({
          ok: false,
          msg: err,
        });
      });
  });
};

const updateUser = async (req, res = response) => {

  const {
    id_usuario,
    id_pais,
    id_estado,
    nombre,
    correo,
    id_estatus,
    id_perfil,
    id_empresa
  } = req.body;
  let image;
  const nombreUpper = nombre.toUpperCase();

  if (req.files) {
    image = `data:${req.files.image.mimetype};base64,${req.files.image.data.toString('base64')}`;
  }

  const auxQuery = image ? `,image='${image}'` : '';
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE usuarios SET nombre=$2, correo=$3, id_estatus=$4, id_estado=$5, id_pais=$6, id_perfil=$7 ${auxQuery} ,id_empresa=$8 where id_usuario=$1`,
        [
          id_usuario,
          nombreUpper,
          correo,
          id_estatus,
          id_estado,
          id_pais,
          id_perfil,
          id_empresa
        ]
      )
      .then((response) => {
        client.release();
        res.status(201).json({
          ok: true,
          data: response.command,
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
};

const updateProfileUser = async (req, res = response) => {

  const {
    idUser,
    stringBase64
  } = req.body;
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE usuarios SET image=$2 where id_usuario=$1`,
        [
          idUser,
          stringBase64
        ]
      )
      .then((response) => {
        client.release();
        res.status(201).json({
          ok: true,
          data: response.command,
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
};

module.exports = {
  getUser,
  postUser,
  updateUser,
  updateProfileUser
};
