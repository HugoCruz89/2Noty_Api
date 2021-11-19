var admin = require("firebase-admin");
var serviceAccount = require("./../serviceAccountKey.json");
const { pool } = require("../dbCongif");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const jwt = require("jsonwebtoken");
const config = require("./../configs/config");
const {
  existTokenNotification,
  insertTokenToPushNotification,
  updateTokenToPushNotification,
  getAllTokensSubscribers,
} = require("./../DataBase/querys");

const sendNotification = async (req, res = response) => {
  const { title, body } = req.body;
  var topics = "weather";
  var registrationToken =
    "fyMOucp1IEpNoEdF-avTyd:APA91bGr574OqhR0RsprtvwdO86mXn1AQDWqquo0mHqa2dHQkVB31ImsC4hay1sTRji1Y_no-wBYzHRT1k8h5khiU-uOKd1ufK7ipUa2DT6atu8g99NRGnFCzy5h0g3y848jpkgO_qGn";

  const topicName = "industry-tech";

  const message = {
    notification: {
      title,
      body
    },
    android: {
      notification: {
        clickAction: "test",
        icon: "splash_icon",
        color: "#7e55c3",
        sound: "default",
        channelId: "Noticias_id",
        imageUrl:
          "https://e1.pngegg.com/pngimages/618/911/png-clipart-handwritten-doodles-and-abr-black-sun.png",
      },

      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          "mutable-content": 1,
        },
      },
      headers: {
        "apns-push-type": "background",
        "apns-priority": "5",
        "apns-topic": "com.alerty", // your app bundle identifier
      },
    },
    token: registrationToken,
    data: {
      route: "Agenda",
      item1: "item1",
      item2: "item2",
    },
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("successfuly sent message:", response);
      res.status(200).json({
        ok: true,
        msg: "send",
      });
    })
    .catch((error) => {
      console.log("error sending message:", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    });


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
          ? await updateTokenToPushNotification(decoded.id_usuario, platform, token)
          : await insertTokenToPushNotification(decoded.id_usuario, platform, token);
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
      .query(`SELECT * FROM tipo_notificacion WHERE UPPER(tipo_notificacion)=$1`, [
        tiponotificacionUpper,
      ])
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
  const aux = (idNotification === 'undefined' || idNotification === '{id}') ? '' : `AND n.id_notificacion=${idNotification}`;
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT n.id_notificacion,n.id_empresa,em.empresa,n.id_marca,m.marca,n.id_suscripcion,s.suscripcion,n.id_tipo_notificacion,tn.tipo_notificacion,n.cuerpo,n.descripcion,n.titulo,n.id_accion,n.url_accion
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
  const { id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion, titulo } = req.body;
  pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO publicaciones(
          id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion,titulo)
          VALUES ($1, $2, $3, $4, $5);`,
        [id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion, titulo]
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
  const { id_notificacion, id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion, titulo } = req.body;
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE publicaciones
        SET id_empresa=$2, id_marca=$3, id_suscripcion=$4, id_tipo_notificacion=$5, notificacion=$6,titulo=$7
        WHERE id_notificacion=$1;`,
        [id_notificacion, id_empresa, id_marca, id_suscripcion, id_tipo_notificacion, notificacion, titulo]
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
  sendNotificationsAllSubscribers
};
