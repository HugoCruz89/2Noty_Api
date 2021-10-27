const { pool } = require("./../dbCongif");


const getUser = async (req, res = response) => {
    pool.connect().then((client) => {
      return client
        .query(`select u.id_usuario, u.nombre,u.correo,u.fecha_registro,p.id_pais,p.pais,ep.id_estado,ep.estado_provincia,e.id_estatus,e.estatus,pr.id_perfil,pr.perfil
        from usuarios u,paises p, estados_provincias ep,estatus e,perfiles pr
        where u.id_pais=p.id_pais and u.id_estado=ep.id_estado and u.id_estatus=e.id_estatus and u.id_perfil=pr.id_perfil
        order by 1;`)
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

  const postUser = async (req, res = response) => {
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
                id_pais, id_estado, nombre, correo, hashedPassword, getDateNow(), id_estatus, id_perfil
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
    getUser,postUser
  }
