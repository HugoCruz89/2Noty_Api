const multer = require("multer");
const { getDateNowCurrent } = require("./../helpers/helpers");

const { pool } = require("./../dbCongif");

const getSubscriptions = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(
        `SELECT sc.id_suscripcion,sc.id_pais,p.pais,sc.id_empresa,em.empresa,sc.id_marca,m.marca,sc.id_categoria_suscripcion,cs.categoria,sc.suscripcion,sc.descripcion,sc.id_estatus,es.estatus,sc.url_imagen,sc.url_icono
        FROM suscripciones sc, paises p, empresas em, marcas m, categoria_suscripcion cs,estatus es
        WHERE sc.id_pais=p.id_pais AND sc.id_empresa=em.id_empresa AND sc.id_marca=m.id_marca AND sc.id_categoria_suscripcion=cs.id_categoria_suscripcion AND sc.id_estatus=es.id_estatus;`
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

// const postSubscription = async (req, res = response) => {
//   const {
//     id_pais,
//     id_empresa,
//     id_marca,
//     id_categoria_suscripcion,
//     suscripcion,
//     descripcion,
//     id_estatus,
//     url_imagen,
//     url_icono,
//   } = req.body;
//   const suscripcionUpperCase = suscripcion.toUpperCase();
//   const descripcionUpperCase = descripcion.toUpperCase();
//   pool.connect().then((client) => {
//     return client
//       .query(
//         `SELECT * FROM suscripciones WHERE id_pais=$1 AND id_empresa=$2 AND id_marca=$3 AND id_categoria_suscripcion=$4 AND UPPER(suscripcion)=$5`,
//         [
//           id_pais,
//           id_empresa,
//           id_marca,
//           id_categoria_suscripcion,
//           suscripcionUpperCase,
//         ]
//       )
//       .then((response) => {
//         if (response.rows.length > 0) {
//           res.status(200).json({
//             ok: true,
//             msg: "Ya se encuentra registrada suscripción",
//           });
//         } else {
//           return client
//             .query(
//               `INSERT INTO public.suscripciones(
//                 id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcion, descripcion, id_estatus,url_imagen,url_icono)
//                 VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9);`,
//               [
//                 id_pais,
//                 id_empresa,
//                 id_marca,
//                 id_categoria_suscripcion,
//                 suscripcionUpperCase,
//                 descripcionUpperCase,
//                 id_estatus,
//                 url_imagen,
//                 url_icono,
//               ]
//             )
//             .then((response) => {
//               client.release();
//               res.status(201).json({
//                 ok: true,
//                 msg: response.command,
//               });
//             })
//             .catch((err) => {
//               client.release();
//               res.status(400).json({
//                 ok: false,
//                 msg: err,
//               });
//             });
//         }
//       })
//       .catch((err) => {
//         client.release();
//         res.status(400).json({
//           ok: false,
//           msg: err,
//         });
//       });
//   });
// };

const postSubscription = async (req, res = response) => {
  let url_imagen;
  let url_icono;
  let uploadPath;
  let uploadPathIcono;
  if (!req.files.imagen || Object.keys(req.files.imagen).length === 0) {
    return res.status(400).send({
      ok: false,
      data: "'No files were uploaded.'",
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  url_imagen = req.files.imagen;
  url_icono=req.files.icono;
  uploadPath = `http://3.136.19.219/assets/img/subscription/${getDateNowCurrent()}-${
    url_imagen.name
  }`;
  uploadPathIcono = `http://3.136.19.219/assets/img/subscription/${getDateNowCurrent()}-${
    url_icono.name
  }`;
  // Use the mv() method to place the file somewhere on your server
  url_icono.mv(uploadPathIcono, function (err) {
    if (err)
      return res.status(500).send({
        ok: false,
        data: err,
      });
    
  });
  // Use the mv() method to place the file somewhere on your server
  url_imagen.mv(uploadPath, function (err) {
    if (err){
      return res.status(500).send({
        ok: false,
        data: err,
      });
    }else{
      const {
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
      const suscripcionUpperCase = suscripcion.toUpperCase();
      const descripcionUpperCase = descripcion.toUpperCase();
      pool.connect().then((client) => {
        return client
          .query(
            `SELECT * FROM suscripciones WHERE id_pais=$1 AND id_empresa=$2 AND id_marca=$3 AND id_categoria_suscripcion=$4 AND UPPER(suscripcion)=$5`,
            [
              id_pais,
              id_empresa,
              id_marca,
              id_categoria_suscripcion,
              suscripcionUpperCase,
            ]
          )
          .then((response) => {
            if (response.rows.length > 0) {
              res.status(200).json({
                ok: true,
                msg: "Ya se encuentra registrada suscripción",
              });
            } else {
              return client
                .query(
                  `INSERT INTO public.suscripciones(
                    id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcion, descripcion, id_estatus,url_imagen,url_icono)
                    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9);`,
                  [
                    id_pais,
                    id_empresa,
                    id_marca,
                    id_categoria_suscripcion,
                    suscripcionUpperCase,
                    descripcionUpperCase,
                    id_estatus,
                    urlImage,
                    UrlIcono,
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
    }
  });
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
