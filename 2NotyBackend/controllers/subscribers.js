const { getDateNow } = require("../helpers/helpers");
const { pool } = require("./../dbCongif");
const getSubscribers = async (req, res = response) => {
    pool.connect().then((client) => {
      return client
        .query(`SELECT s.id_suscriptor,s.id_usuario,u.nombre,s.id_suscripcion,sc.suscripcion,to_char((s.fecha_suscripcion), 'DD/MM/YYYY')as fecha_suscripcion,s.id_estatus,e.estatus 
        FROM suscriptores s, usuarios u, suscripciones sc, estatus e
        WHERE s.id_usuario=u.id_usuario AND s.id_suscripcion=sc.id_suscripcion AND s.id_estatus=e.id_estatus;`)
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
        .query(`UPDATE public.suscriptores
        SET id_usuario=$2, id_suscripcion=$3, id_estatus=$4
        WHERE id_suscriptor=$1;`, [
          id_suscriptor, id_usuario, id_suscripcion, id_estatus
        ])
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
    const { id_usuario, id_suscripcion, id_estatus } = req.body;
    pool.connect().then((client) => {
      return client
        .query(`select * from suscriptores WHERE id_usuario=$1 AND id_suscripcion=$2`,
          [id_usuario, id_suscripcion])
        .then((response) => {
          if (response.rows.length > 0) {
            res.status(200).json({
              ok: true,
              msg: "Ya existe una suscripción con el mismo usuario",
            });
          } else {
            return client
              .query(`INSERT INTO public.suscriptores(
                id_usuario, id_suscripcion, fecha_suscripcion, id_estatus)
                VALUES ($1, $2, $3, $4);`, [
                id_usuario, id_suscripcion, getDateNow(), id_estatus
              ])
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
  module.exports={
    getSubscribers,
    updateSubscribers,
    postSubscribers
  }