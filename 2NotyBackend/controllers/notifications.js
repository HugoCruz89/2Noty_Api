const { pool } = require("../dbCongif");
const jwt = require("jsonwebtoken");
const config = require("./../configs/config");
const { SendSingleNotification,SendMultiNotifications } = require("./../helpers/notifications");
const {
  existTokenNotification,
  insertTokenToPushNotification,
  updateTokenToPushNotification,
  getAllTokensSubscribers,
} = require("./../DataBase/querys");

const sendNotification = async (req, res = response) => {
  const { title, body,token,imageUrl } = req.body;
  const respuestaNotification =await SendMultiNotifications( title, body,token,imageUrl );
  return res.status(200).json(respuestaNotification);
};
const insertToken = async (req, res = response) => {
  const tokenAuth = req.headers["access-token"];

  const { token, platform } = req.body;
  if (tokenAuth) {
    jwt.verify(tokenAuth, config.llave, async (err, decoded) => {
      if (err) {
        return res.status(200).json({
          ok: false,
          msg: "Token inválida",
        });
      } else {
        req.decoded = decoded;
        let respuestaDatabase = await existTokenNotification(
          decoded.id_usuario
        );
        respuestaDatabase = respuestaDatabase.ok
          ? await updateTokenToPushNotification(
              decoded.id_usuario,
              platform,
              token
            )
          : await insertTokenToPushNotification(
              decoded.id_usuario,
              platform,
              token
            );
        return res.status(201).send(respuestaDatabase);
      }
    });
  } else {
    res.status(400).json({
      ok: false,
      msg: "Token no proveída.",
    });
  }
};

const getTypeNotification = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT tn.*,e.estatus FROM tipo_notificacion tn, estatus e
        WHERE tn.id_estatus=e.id_estatus;`
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

const postTypeNotification = async (req, res = response) => {
  const { tipo_notificacion, id_estatus } = req.body;
  const tiponotificacionUpper = tipo_notificacion.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT * FROM tipo_notificacion WHERE UPPER(tipo_notificacion)=$1`,
        [tiponotificacionUpper]
      )
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya existe el tipo de notificación",
          });
        } else {
          return client
            .query(
              `INSERT INTO tipo_notificacion (
                tipo_notificacion, id_estatus)
                VALUES ($1, $2);`,
              [tiponotificacionUpper, id_estatus]
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

const updateTypeNotification = async (req, res = response) => {
  const { id_tipo_notificacion, tipo_notificacion, id_estatus } = req.body;
  const tiponotificacionUpper = tipo_notificacion.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE tipo_notificacion
        SET tipo_notificacion=$2, id_estatus=$3
        WHERE id_tipo_notificacion=$1;`,
        [id_tipo_notificacion, tiponotificacionUpper, id_estatus]
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

const getNotification = async (req, res = response) => {
  const idNotification = req.params.id;
  const aux = (idNotification === 'undefined' || idNotification === '{id}') ? '' : `AND n.id_publicacion=${idNotification}`;
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT n.id_publicacion,n.id_empresa,em.empresa,n.id_marca,m.marca,n.id_suscripcion,s.suscripcion,n.id_tipo_notificacion,tn.tipo_notificacion,n.cuerpo,n.descripcion,n.titulo,n.id_accion,n.url_accion
        FROM publicaciones n, empresas em, marcas m, suscripciones s, tipo_notificacion tn
        WHERE n.id_empresa=em.id_empresa AND n.id_marca=m.id_marca AND n.id_suscripcion=s.id_suscripcion AND n.id_tipo_notificacion=tn.id_tipo_notificacion ${aux};`
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

const postNotification = async (req, res = response) => {
  const {
    id_empresa,
    id_marca,
    id_suscripcion,
    id_tipo_notificacion,
    notificacion,
    titulo,
  } = req.body;
  pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO publicaciones(
          id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion,titulo)
          VALUES ($1, $2, $3, $4, $5);`,
        [
          id_empresa,
          id_marca,
          id_suscripcion,
          id_tipo_notificacion,
          notificacion,
          titulo,
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
  });
};

const updateNotification = async (req, res = response) => {
  const { id_publicacion, id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion, titulo } = req.body;
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE publicaciones
        SET id_empresa=$2, id_marca=$3, id_suscripcion=$4, id_tipo_notificacion=$5, notificacion=$6,titulo=$7
        WHERE id_publicacion=$1;`,
        [id_publicacion, id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion, titulo]
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

const sendNotificationsAllSubscribers = async (req, res = response) => {
  const { idSubscription, title, body } = req.body;
  const responseData = await getAllTokensSubscribers(idSubscription);
  if (responseData.ok)
    console.log(responseData)
};

module.exports = {
  sendNotification,
  insertToken,
  getTypeNotification,
  postTypeNotification,
  updateTypeNotification,
  getNotification,
  postNotification,
  updateNotification,
  sendNotificationsAllSubscribers,
};
