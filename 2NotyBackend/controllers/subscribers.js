const { insertSuscriptor, existSubscritor,insertSuscriptorPropertyes } = require("./../DataBase/querys");
const { pool } = require("./../dbCongif");
const jwt = require("jsonwebtoken");
const config = require("./../configs/config");
const getSubscribers = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT s.id_suscriptor,s.id_usuario,u.nombre,s.id_suscripcion,sc.suscripcion,to_char((s.fecha_suscripcion), 'DD/MM/YYYY')as fecha_suscripcion,s.id_estatus,e.estatus 
        FROM suscriptores s, usuarios u, suscripciones sc, estatus e
        WHERE s.id_usuario=u.id_usuario AND s.id_suscripcion=sc.id_suscripcion AND s.id_estatus=e.id_estatus;`
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

const updateSubscribers = async (req, res = response) => {
  const { id_suscriptor, id_usuario, id_suscripcion, id_estatus } = req.body;
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE public.suscriptores
        SET id_usuario=$2, id_suscripcion=$3, id_estatus=$4
        WHERE id_suscriptor=$1;`,
        [id_suscriptor, id_usuario, id_suscripcion, id_estatus]
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

const postSubscribers = async (req, res = response) => {
  const tokenAuth = req.headers["access-token"];

  if (tokenAuth) {
    jwt.verify(tokenAuth, config.llave, async (err, decoded) => {
      if (err) {
        return res.status(200).json({
          ok: false,
          msg: "Token inválida",
        });
      } else {
        let respuestaDatabase = await existSubscritor(
          req.body,
          decoded.id_usuario
        );
        if (!respuestaDatabase.ok) {
          respuestaDatabase = await insertSuscriptor(
            req.body,
            decoded.id_usuario
          );       
           const {propertyes}=req.body;
           propertyes.map(item=>{
            insertSuscriptorPropertyes(respuestaDatabase.idSuscriptor,item.descripcion,item.valor)
           })
        }

        return res.status(respuestaDatabase.codigo).send(respuestaDatabase);
      }
    });
  } else {
    res.status(400).json({
      ok: false,
      msg: "Token no proveída.",
    });
  }
};
module.exports = {
  getSubscribers,
  updateSubscribers,
  postSubscribers,
};
