const {
  buildPathToSaveDataBaseImage,
  buildPathToSaveServerImage,
} = require("./../helpers/helpers");

const { pool } = require("./../dbCongif");
const {
  existSubscrition,
  insertSubscription,
  insertPropiedadesSuscripcion,
  getAllSubscription,
} = require("./../DataBase/querys");
const { response } = require("express");
// const { report } = require("../routes/subscritions");
require("dotenv").config();

const getSubscriptions = async (req, res = response) => {
  const getResponse = await getAllSubscription();
  if (getResponse.ok) {
    return res.status(201).json(getResponse);
  } else {
    return res.status(400).json(getResponse);
  }
};

const getSubscriptionDetail = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT ds.id_detalle,ds.id_suscriptor,u.nombre,ds.descripcion,ds.valor 
        FROM detalle_suscripcion ds, suscriptores s,usuarios u
        WHERE ds.id_suscriptor=s.id_suscriptor AND s.id_usuario=u.id_usuario;`
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

const postSubscription = async (req, res = response) => {
  const {
    id_pais,
    id_empresa,
    id_marca,
    id_categoria_suscripcion,
    suscripcion,
    propiedadesSuscripcion,
  } = req.body;

  const respuestaDatabase = await existSubscrition(
    id_pais,
    id_empresa,
    id_marca,
    id_categoria_suscripcion,
    suscripcion.toUpperCase()
  );
  if (respuestaDatabase.ok) {
    return res.status(200).send(respuestaDatabase);
  } else {
    if (!req.files.imagen || Object.keys(req.files.imagen).length === 0) {
      return res.status(400).send({
        ok: false,
        data: "'No files were uploaded.'",
      });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let url_imagen = req.files.imagen;
    let url_icono = req.files.icono;

    // Use the mv() method to place the file somewhere on your server
    url_icono.mv(buildPathToSaveServerImage(url_icono.name), function (err) {
      if (err)
        return res.status(500).send({
          ok: false,
          data: err,
        });
    });
    // Use the mv() method to place the file somewhere on your server
    url_imagen.mv(
      buildPathToSaveServerImage(url_imagen.name),
      async function (err) {
        if (err) {
          return res.status(500).send({
            ok: false,
            data: err,
          });
        }
      }
    );

    const insertResponse = await insertSubscription(
      req.body,
      buildPathToSaveDataBaseImage(url_imagen.name),
      buildPathToSaveDataBaseImage(url_icono.name)
    );
    if (insertResponse.ok) {
      //extraigo el id
      const respuestaDatabase = await existSubscrition(
        id_pais,
        id_empresa,
        id_marca,
        id_categoria_suscripcion,
        suscripcion.toUpperCase()
      );
      //inserto las propiedades
      const Properties = JSON.parse(propiedadesSuscripcion);
      Properties.map((item) => {
        insertPropiedadesSuscripcion(item, respuestaDatabase.id_suscripcion);
      });
      return res.status(201).json(insertResponse);
    } else {
      return res.status(400).json(insertResponse);
    }
  }
};

const updateSubscription = async (req, res = response) => {
  const {
    id_suscripcion,
    id_pais,
    id_empresa,
    id_marca,
    id_categoria_suscripcion,
    suscripcion,
    descripcion,
    id_estatus,
    url_imagen,
    url_icono,
  } = req.body;
  const suscripcionUpper = suscripcion.toUpperCase();
  const descripcionUpper = descripcion.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE public.suscripciones
        SET  id_pais=$2, id_empresa=$3, id_marca=$4, id_categoria_suscripcion=$5, suscripcion=$6, descripcion=$7, id_estatus=$8, url_imagen=$9, url_icono=$10
        WHERE id_suscripcion=$1;`,
        [
          id_suscripcion,
          id_pais,
          id_empresa,
          id_marca,
          id_categoria_suscripcion,
          suscripcionUpper,
          descripcionUpper,
          id_estatus,
          url_imagen,
          url_icono,
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
  getSubscriptions,
  getSubscriptionDetail,
  postSubscription,
  updateSubscription,
};
