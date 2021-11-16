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
  updateSubscription,
  updatePropiedadesSuscripcion,
  getAllSubscriptionByIdCategory
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


const getSubscriptionsByIdCategory = async (req, res = response) => {
  const id_Category = req.params.id;
  const getResponse = await getAllSubscriptionByIdCategory(id_Category);
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

const putSubscription = async (req, res = response) => {
  const { id_suscripcion, propiedadesSuscripcion } = req.body;
  let url_imagen;
  let url_icono;
  if (req.files !== null && req.files.imagen !== undefined) {
    url_imagen = req.files.imagen;
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
  }

  if (req.files !== null && req.files.icono !== undefined) {
    url_icono = req.files.icono;
    // Use the mv() method to place the file somewhere on your server
    url_icono.mv(buildPathToSaveServerImage(url_icono.name), function (err) {
      if (err)
        return res.status(500).send({
          ok: false,
          data: err,
        });
    });
  }

  const updateResponse = await updateSubscription(
    req.body,
    buildPathToSaveDataBaseImage(url_imagen?.name),
    buildPathToSaveDataBaseImage(url_icono?.name)
  );
  if (updateResponse.ok) {
    //modifico las propiedades
    const Properties = JSON.parse(propiedadesSuscripcion);
    Properties.map((item) => {
      updatePropiedadesSuscripcion(item, id_suscripcion);
    });
    return res.status(201).json(updateResponse);
  } else {
    return res.status(400).json(updateResponse);
  }

};
const postCategorySubscription = async (req, res = response) => {
  const { categoria, id_estatus, name_icono, color } = req.body;

  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM categoria_suscripcion WHERE upper(categoria)=$1`, [
        categoria,
      ])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra registrada la categoria",
          });
        } else {
          return client
            .query(
              `INSERT INTO categoria_suscripcion(categoria, id_estatus,name_icono,color)
              VALUES($1,$2,$3,$4)`,
              [categoria, id_estatus, name_icono, color]
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

const getCategoriesSubscription = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(
        `select *
      from categoria_suscripcion cs, estatus e 
      where cs.id_estatus=e.id_estatus;`
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
  getSubscriptions,
  getSubscriptionDetail,
  postSubscription,
  putSubscription,
  postCategorySubscription,
  getCategoriesSubscription,
  getSubscriptionsByIdCategory
};
