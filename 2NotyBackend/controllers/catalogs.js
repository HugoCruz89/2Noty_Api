const { response } = require("express");
const { param } = require("express-validator");
const bcrypt = require("bcrypt");
const { pool } = require("./../dbCongif");
const getStatus = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM estatus ORDER BY estatus`)
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
      .query(`SELECT * FROM paises ORDER BY pais`)
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
  const idCountry = req.params.id;
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM estados_provincias WHERE id_pais= $1`,[idCountry])
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

const updateState = async (req, res = response) => {
  const { id_pais, id_estatus, estado_provincia, id_estado } = req.body;
  const estadoUpperCase = estado_provincia.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(
        `UPDATE estados_provincias SET id_estatus=$2, id_pais=$3, estado_provincia=$4 where id_estado=$1`,
        [id_estado, id_estatus, id_pais, estadoUpperCase]
      )
      .then((response) => {
        client.release();
        res.status(200).json({
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

const updateCountry = async (req, res = response) => {
  const { idPais, idEstatus, pais } = req.body;
  const countryUpper = pais.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE paises SET id_estatus=$2, pais=$3 where id_pais=$1`, [
        idPais,
        idEstatus,
        countryUpper,
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
const updateStatus = async (req, res = response) => {
  const { id_estatus, estatus } = req.body;
  const estatusUpper = estatus.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE estatus SET estatus=$2 where id_estatus=$1`, [
        id_estatus,
        estatusUpper
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

const updateProfiles = async (req, res = response) => {
  const { id_perfil, perfil, id_estatus } = req.body;
  const perfilUpper = perfil.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE perfiles SET perfil=$2, id_estatus=$3 where id_perfil=$1`, [
        id_perfil,
        perfilUpper,
        id_estatus
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

const activateCountry = async (req, res = response) => {
  const idCountry = req.params.id;
  pool.connect().then((client) => {
    return client
      .query(`UPDATE paises SET id_estatus=1 where id_pais=$1`, [idCountry])
      .then((response) => {
        client.release();
        res.status(200).json({
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
const activateState = async (req, res = response) => {
  const idState = req.params.id;
  pool.connect().then((client) => {
    return client
      .query(`UPDATE estados_provincias SET id_estatus=1 where id_estado=$1`, [
        idState,
      ])
      .then((response) => {
        client.release();
        res.status(200).json({
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
const postStates = async (req, res = response) => {
  const { id_country, state, id_status } = req.body;
  const stateUpperCase = state.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM estados_provincias WHERE estado_provincia = $1`, [
        stateUpperCase,
      ])
      .then((response) => {
        if (response.rowCount > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra el estado dentro de base de datos",
          });
        } else {
          return client
            .query(
              `INSERT INTO estados_provincias(id_pais,estado_provincia,id_estatus) VALUES($1,$2,$3)`,
              [id_country, stateUpperCase, id_status]
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
const postContry = async (req, res = response) => {
  const { country } = req.body;
  const countryUpperCase = country.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM PAISES WHERE pais=$1`, [countryUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra el pais dentro de base de datos",
          });
        } else {
          return client
            .query(`INSERT INTO paises(pais,id_estatus) VALUES($1,$2)`, [
              countryUpperCase,
              1,
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

const postStatus = async (req, res = response) => {
  const { status } = req.body;
  const statusUpperCase = status.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM ESTATUS WHERE estatus=$1`, [statusUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra el estatus dentro de base de datos",
          });
        } else {
          return client
            .query(`INSERT INTO estatus(estatus) VALUES($1)`, [
              statusUpperCase
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

const postProfiles = async (req, res = response) => {
  const { perfil, id_estatus } = req.body;
  const perfilUpperCase = perfil.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM perfiles WHERE perfil=$1`, [perfilUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra el perfil dentro de base de datos",
          });
        } else {
          return client
            .query(`INSERT INTO perfiles(perfil,id_estatus) VALUES($1,$2)`, [
              perfilUpperCase, id_estatus
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

const postUsers = async (req, res = response) => {
  const { nombre, correo, password, id_estatus, id_estado, id_pais, id_perfil } = req.body;

  let hashedPassword = await bcrypt.hash(password, 10);

  const emailUpperCase = correo.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM usuarios WHERE upper(correo)=$1`, [emailUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra registrado el correo",
          });
        } else {
          return client
            .query(`INSERT INTO usuarios( id_pais, id_estado, nombre, correo, password, fecha_registro, id_estatus, id_perfil)
              VALUES($1,$2,$3,$4,$5,$6,$7,$8)`, [
              id_pais,id_estado,nombre,correo,hashedPassword,getDateNow(),id_estatus,id_perfil
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
module.exports = {
  getStatus,
  getCountries,
  getStates,
  getProfiles,
  getUsuarios,
  postStates,
  postContry,
  postStatus,
  postProfiles,
  postUsers,
  updateState,
  updateCountry,
  updateStatus,
  updateProfiles,
  activateCountry,
  activateState,
};
