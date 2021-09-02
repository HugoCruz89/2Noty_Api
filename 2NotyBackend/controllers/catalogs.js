const { response } = require("express");
const { pool } = require("./../dbCongif");
const getStatus = async (req, res = response) => {
    pool.connect().then((client) => {
        return client
          .query(
            `SELECT * FROM estatus `,
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

const getCountries = async (req, res = response) => {
    pool.connect().then((client) => {
        return client
          .query(
            `SELECT * FROM paises `,
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
const getStates = async (req, res = response) => {
    pool.connect().then((client) => {
        return client
          .query(
            `SELECT * FROM estados_provincias`,
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

module.exports={getStatus,getCountries,getStates}
