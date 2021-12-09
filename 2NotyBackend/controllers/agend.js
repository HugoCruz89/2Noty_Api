const { response } = require("express");

const { pool } = require("./../dbCongif");

const register = async (req, res = response) => {
  const { id_usuario, fecha, asunto, titulo } = req.body;
console.log('>>>>>>>>>>>',id_usuario, fecha, asunto, titulo)
  pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO agenda(id_usuario, fecha,asunto,titulo)
                       VALUES($1,$2,$3,$4)`,
        [id_usuario, fecha, asunto, titulo]
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
