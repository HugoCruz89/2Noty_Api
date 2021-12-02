const { pool } = require("../dbCongif");
const jwt = require("jsonwebtoken");
const config = require("./../configs/config");
const { SendSingleNotification, SendMultiNotifications } = require("./../helpers/notifications");
const {
  existTokenNotification,
  insertTokenToPushNotification,
  updateTokenToPushNotification,
  getAllTokensSubscribers,
  insertUserPublication,
  updateStatusPublication,
} = require("./../DataBase/querys");
const { buildPathToSaveDataBaseImage, buildPathToSaveServerImage, createName } = require("../helpers/helpers");

const sendNotification = async (req, res = response) => {
  const { title, body, token, imageUrl } = req.body;
  const respuestaNotification = await SendMultiNotifications(title, body, token, imageUrl);
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
        `SELECT n.id_publicacion,n.id_empresa,em.empresa,n.id_marca,m.marca,n.id_suscripcion,s.suscripcion,n.id_tipo_notificacion,tn.tipo_notificacion,n.cuerpo,n.descripcion,n.titulo,n.id_accion,n.url_accion,CASE WHEN n.url_imagen='' THEN s.url_imagen ELSE n.url_imagen END,to_char(fecha_inicio,'YYYY-MM-DD') as fecha_inicio,to_char(fecha_fin,'YYYY-MM-DD') as fecha_fin, n.id_estatus, e.estatus
        FROM publicaciones n, empresas em, marcas m, suscripciones s, tipo_notificacion tn, estatus e
        WHERE n.id_empresa=em.id_empresa AND n.id_marca=m.id_marca AND n.id_suscripcion=s.id_suscripcion AND n.id_tipo_notificacion=tn.id_tipo_notificacion AND n.id_estatus=e.id_estatus ${aux};`
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
    cuerpo,
    titulo,
    id_accion,
    url_accion,
    descripcion,
    fecha_inicio,
    fecha_fin
  } = req.body;
  let url_imagen = '';
  if (req.files) {
    file = req.files.imagen;
    file.mv(
      buildPathToSaveServerImage(file.name),
      async function (err) {
        if (err) {
          return res.status(500).send({
            ok: false,
            data: err,
          });
        }
      }
    );
    url_imagen = buildPathToSaveDataBaseImage(file.name);
  }
  pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO public.publicaciones(
          id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, cuerpo, titulo, id_accion, url_accion, url_imagen, descripcion, fecha_inicio, fecha_fin, id_estatus)
          VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 4);`,
        [
          id_empresa,
          id_marca,
          id_suscripcion,
          id_tipo_notificacion,
          cuerpo,
          titulo,
          id_accion,
          url_accion,
          url_imagen,
          descripcion,
          fecha_inicio,
          fecha_fin
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
  const { id_publicacion, id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, cuerpo, titulo, id_accion, url_accion, descripcion, fecha_inicio, fecha_fin } = req.body;
  let url_imagen = '';
  if (req.files) {
    file = req.files.imagen;
    const nameImage=createName(file.name);
    file.mv(
      buildPathToSaveServerImage(nameImage),
      async function (err) {
        if (err) {
          return res.status(500).send({
            ok: false,
            data: err,
          });
        }
      }
    );
    url_imagen = buildPathToSaveDataBaseImage(nameImage);
  };
  const script = url_imagen ? ` ,url_imagen='${url_imagen}'` : '';

  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE public.publicaciones
        SET id_empresa=$2, id_marca=$3, id_suscripcion=$4, id_tipo_notificacion=$5, cuerpo=$6, titulo=$7, id_accion=$8, url_accion=$9, descripcion=$10, fecha_inicio=$11, fecha_fin=$12 ${script}
        WHERE id_publicacion=$1;`,
        [id_publicacion, id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, cuerpo, titulo, id_accion, url_accion, descripcion, fecha_inicio, fecha_fin]
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
  const { idSubscription, title, body, idPublicacion, urlImagen } = req.body;
  const responseData = await getAllTokensSubscribers(idSubscription);
  if (responseData.data[0].jsontokens) {
    const arrayIdUser = responseData.data[0].jsonusers;
    const respuestaNotification = await SendMultiNotifications(title, body, responseData.data[0].jsontokens, urlImagen);
    if (respuestaNotification.ok) {
      arrayIdUser.forEach((val) => {
        insertUserPublication(val, idPublicacion);
      });
      updateStatusPublication(idPublicacion);
      return res.status(201).json({
        ok: true,
        msg: 'SEND'
      });
    }
    else {
      return res.status(400).json({
        ok: false,
        msg: respuestaNotification.msg
      });
    }
  }
  else {
    return res.status(400).json({
      ok: false,
      msg: 'No hay suscriptores'
    });
  }
};

const getPublicationsByIdUser = async (req, res = response) => {
  const idUser = req.params.id;
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT p.id_publicacion,p.titulo,p.cuerpo,p.descripcion,p.url_accion, CASE WHEN p.url_imagen='' THEN (SELECT s.url_imagen FROM suscripciones s WHERE s.id_suscripcion=p.id_suscripcion) ELSE p.url_imagen END
        FROM publicacion_usuario ps, publicaciones p
        WHERE ps.id_publicacion=p.id_publicacion 
        AND ps.id_usuario=$1 AND ps.id_estatus=1 AND to_char(p.fecha_fin,'YYYYMMDD')::integer >= to_char(current_timestamp,'YYYYMMDD')::integer;`,
        [idUser]
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
  getPublicationsByIdUser
};
