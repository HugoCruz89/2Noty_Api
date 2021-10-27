const { pool } = require("../dbCongif");

const getPaymentTypes = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT tp.id_tipo_pago,tp.tipo_pago,tp.id_estatus,e.estatus 
        FROM tipo_pago tp, estatus e
        WHERE tp.id_estatus=e.id_estatus;`
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

const getPaymentMethod = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT mp.id_medio_pago,mp.id_usuario,u.nombre,mp.id_tipo_pago,tp.tipo_pago,mp.numero_tarjeta_cuenta,mp.correo,to_char((mp.fecha_vigencia), 'DD/MM/YYYY')as fecha_vigencia 
        FROM medios_pago mp, usuarios u, tipo_pago tp
        WHERE mp.id_usuario=u.id_usuario AND mp.id_tipo_pago=tp.id_tipo_pago;`
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

const updatePaymentType = async (req, res = response) => {
  const { id_tipo_pago, tipo_pago, id_estatus } = req.body;
  const tipopagoUpper = tipo_pago.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE tipo_pago
        SET tipo_pago=$2, id_estatus=$3
        WHERE id_tipo_pago=$1;`,
        [id_tipo_pago, tipopagoUpper, id_estatus]
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

const postPaymentType = async (req, res = response) => {
  const { tipo_pago, id_estatus } = req.body;
  const tipopagoUpper = tipo_pago.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM tipo_pago WHERE UPPER(tipo_pago)=$1`, [
        tipopagoUpper,
      ])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya existe el tipo de pago",
          });
        } else {
          return client
            .query(
              `INSERT INTO tipo_pago (
                tipo_pago, id_estatus)
                VALUES ($1, $2);`,
              [tipopagoUpper, id_estatus]
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

const postPaymentMethod = async (req, res = response) => {
  const {
    id_usuario,
    id_tipo_pago,
    numero_tarjeta_cuenta,
    correo,
    fecha_vigencia,
  } = req.body;
  pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO medios_pago (
                id_usuario,id_tipo_pago,numero_tarjeta_cuenta,correo,fecha_vigencia)
                VALUES ($1, $2, $3, $4, $5);`,
        [
          id_usuario,
          id_tipo_pago,
          numero_tarjeta_cuenta,
          correo,
          fecha_vigencia,
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
module.exports = {
  getPaymentTypes,
  getPaymentMethod,
  updatePaymentType,
  postPaymentType,
  postPaymentMethod,
};
