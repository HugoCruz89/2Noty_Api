const { response } = require("express");

const { pool } = require("./../dbCongif");

const register = async (req, res = response) => {
  const { id_usuario, fecha, asunto, titulo,hora,id_recordatorio } = req.body;

  pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO agenda(id_usuario, fecha,asunto,titulo,hora,id_recordatorio)
                       VALUES($1,$2,$3,$4,$5,$6)`,
        [id_usuario, fecha, asunto, titulo,hora,id_recordatorio]
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
        res.status(200).json({
          ok: false,
          msg: err,
        });
      });
  });
};

module.exports = { register };
