var admin = require("firebase-admin");
var serviceAccount = require("./../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const jwt = require("jsonwebtoken");
const config = require("./../configs/config");
const { pool } = require("../dbCongif");
const sendNotification = async (req, res = response) => {
  const { body } = req.body;
  var topics = "weather";
  var registrationToken =
    "fyMOucp1IEpNoEdF-avTyd:APA91bGr574OqhR0RsprtvwdO86mXn1AQDWqquo0mHqa2dHQkVB31ImsC4hay1sTRji1Y_no-wBYzHRT1k8h5khiU-uOKd1ufK7ipUa2DT6atu8g99NRGnFCzy5h0g3y848jpkgO_qGn";

  const topicName = "industry-tech";

  const message = {
    notification: {
      title: "`$FooCorp` up 1.43% on the day",
      body: "FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.",
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
    })
    .catch((error) => {
      console.log("error sending message:", error);
    });

  res.status(200).json({
    ok: true,
    msg: "test",
  });
};
const insertToken = async (req, res = response) => {

  const tokenAuth = req.headers["access-token"];
  console.log('tokenAuth',tokenAuth)
  const {
    token,
    platform
  } = req.body;
  if (tokenAuth) {
    jwt.verify(tokenAuth, config.llave, (err, decoded) => {
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
  // const {
  //   id_usuario,
  //   id_tipo_pago,
  //   numero_tarjeta_cuenta,
  //   correo,
  //   fecha_vigencia,
  // } = req.body;
  // pool.connect().then((client) => {
  //   return client
  //     .query(
  //       `INSERT INTO medios_pago (
  //               id_usuario,id_tipo_pago,numero_tarjeta_cuenta,correo,fecha_vigencia)
  //               VALUES ($1, $2, $3, $4, $5);`,
  //       [
  //         id_usuario,
  //         id_tipo_pago,
  //         numero_tarjeta_cuenta,
  //         correo,
  //         fecha_vigencia,
  //       ]
  //     )
  //     .then((response) => {
  //       client.release();
  //       res.status(201).json({
  //         ok: true,
  //         msg: response.command,
  //       });
  //     })
  //     .catch((err) => {
  //       client.release();
  //       res.status(400).json({
  //         ok: false,
  //         msg: err,
  //       });
  //     });
  // });
};



module.exports = {
  sendNotification,
  insertToken,
};
