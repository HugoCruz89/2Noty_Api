const { response } = require("express");

const { pool } = require("./../dbCongif");
const register = async (req, res = response) => {
  const { id_usuario, fecha, asunto, titulo, hora, id_recordatorio } = req.body;

  pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO agenda(id_usuario, fecha,asunto,titulo,hora,id_recordatorio)
                       VALUES($1,$2,$3,$4,$5,$6)`,
        [id_usuario, fecha, asunto, titulo, hora, id_recordatorio]
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
const getReminders = async (req, res = response) => {
  const idUsuario = req.params.id;
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT a.fecha,(SELECT array_to_json(array_agg(b.*)) FROM agenda b WHERE b.fecha=a.fecha AND b.id_usuario=$1 ) FROM agenda a group by fecha;`,
        [idUsuario]
      )
      .then((response) => {
        client.release();
        res.status(200).json({
          ok: true,
          data: response.rowCount > 0 ? response.rows.filter(x => x.array_to_json !== null) : [],
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

module.exports = { register, getReminders };
