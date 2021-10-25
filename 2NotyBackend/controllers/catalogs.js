const { response } = require("express");
const { param } = require("express-validator");
const bcrypt = require("bcrypt");
const { getDateNow } = require("./../helpers/helpers");
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
      .query(`SELECT * FROM estados_provincias WHERE id_pais= $1`, [idCountry])
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
const getProfiles = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM perfiles ORDER BY perfil`)
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
const getUsuarios = async (req, res = response) => {
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
const getCompanies = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`select e.id_empresa,e.id_pais,p.pais,e.empresa,e.razon_social,e.no_contrato 
      from empresas e, paises p where e.id_pais=p.id_pais;`)
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
const getBills = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT f.id_factura,f.id_empresa, e.empresa, f.id_marca,m.marca,f.monto,to_char((f.fecha_emision), 'DD/MM/YYYY') as fecha_emision,f.periodo,f.id_estatus, es.estatus
      FROM facturas f, empresas e, marcas m, estatus es
      WHERE f.id_empresa=e.id_empresa AND f.id_marca=m.id_marca AND f.id_estatus=es.id_estatus;`)
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
const getCategories = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`select cs.id_categoria_suscripcion,cs.categoria,cs.id_estatus,e.estatus
      from categoria_suscripcion cs, estatus e 
      where cs.id_estatus=e.id_estatus;`)
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
const getMarks = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT m.id_marca,m.id_empresa,e.empresa,m.marca FROM marcas m, empresas e WHERE m.id_empresa=e.id_empresa;`)
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
const getSubscriptions = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT sc.id_suscripcion,sc.id_pais,p.pais,sc.id_empresa,em.empresa,sc.id_marca,m.marca,sc.id_categoria_suscripcion,cs.categoria,sc.suscripcion,sc.descripcion,sc.id_estatus,es.estatus,sc.url_imagen,sc.url_icono
      FROM suscripciones sc, paises p, empresas em, marcas m, categoria_suscripcion cs,estatus es
      WHERE sc.id_pais=p.id_pais AND sc.id_empresa=em.id_empresa AND sc.id_marca=m.id_marca AND sc.id_categoria_suscripcion=cs.id_categoria_suscripcion AND sc.id_estatus=es.id_estatus;`)
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
const getTypespay = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT tp.id_tipo_pago,tp.tipo_pago,tp.id_estatus,e.estatus 
      FROM tipo_pago tp, estatus e
      WHERE tp.id_estatus=e.id_estatus;`)
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
const getPaymentsmeans = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT mp.id_medio_pago,mp.id_usuario,u.nombre,mp.id_tipo_pago,tp.tipo_pago,mp.numero_tarjeta_cuenta,mp.correo,mp.fecha_vigencia
      FROM medios_pago mp, usuarios u, tipo_pago tp
      WHERE mp.id_usuario=u.id_usuario AND mp.id_tipo_pago=tp.id_tipo_pago;`)
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
const getSubscriptiondetail = async (req, res = response) => {
  pool.connect().then((client) => {
    return client
      .query(`SELECT ds.id_detalle,ds.id_suscriptor,u.nombre,ds.descripcion,ds.valor 
      FROM detalle_suscripcion ds, suscriptores s,usuarios u
      WHERE ds.id_suscriptor=s.id_suscriptor AND s.id_usuario=u.id_usuario;`)
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
const updateUser = async (req, res = response) => {
  const { id_usuario, id_pais, id_estado, nombre, correo, id_estatus, id_perfil } = req.body;
  const nombreUpper = nombre.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE usuarios SET nombre=$2, correo=$3, id_estatus=$4, id_estado=$5, id_pais=$6, id_perfil=$7 where id_usuario=$1`, [
        id_usuario, nombreUpper, correo, id_estatus, id_estado, id_pais, id_perfil
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
const updateCompany = async (req, res = response) => {
  const { id_empresa, id_pais, empresa, razon_social, no_contrato } = req.body;
  const empresaUpper = empresa.toUpperCase();
  const razonSocialUpper = razon_social.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE empresas SET id_pais=$2, empresa=$3, razon_social=$4, no_contrato=$5 where id_empresa=$1`, [
        id_empresa,
        id_pais,
        empresaUpper,
        razonSocialUpper,
        no_contrato
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
const updateCategory = async (req, res = response) => {
  const { id_categoria_suscripcion, categoria, id_estatus } = req.body;
  const categoriaUpper = categoria.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE categoria_suscripcion SET categoria=$2, id_estatus=$3 WHERE id_categoria_suscripcion=$1`, [
        id_categoria_suscripcion,
        categoriaUpper,
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
const updateMark = async (req, res = response) => {
  const { id_marca, id_empresa, marca } = req.body;
  const marcaUpper = marca.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE marcas SET id_empresa=$2, marca=$3 WHERE id_marca=$1`, [
        id_marca,
        id_empresa,
        marcaUpper
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
const updateSubscription = async (req, res = response) => {
  const { id_suscripcion, id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcion, descripcion, id_estatus } = req.body;
  const suscripcionUpper = suscripcion.toUpperCase();
  const descripcionUpper = descripcion.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE public.suscripciones
      SET  id_pais=$2, id_empresa=$3, id_marca=$4, id_categoria_suscripcion=$5, suscripcion=$6, descripcion=$7, id_estatus=$8
      WHERE id_suscripcion=$1;`, [
        id_suscripcion, id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcionUpper, descripcionUpper, id_estatus
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
const updateSubscriptor = async (req, res = response) => {
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
const updateTypepay = async (req, res = response) => {
  const { id_tipo_pago, tipo_pago, id_estatus } = req.body;
  const tipopagoUpper = tipo_pago.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`UPDATE tipo_pago
      SET tipo_pago=$2, id_estatus=$3
      WHERE id_tipo_pago=$1;`, [
        id_tipo_pago, tipopagoUpper, id_estatus
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
const postCompany = async (req, res = response) => {
  const { id_pais, empresa, razon_social, no_contrato } = req.body;
  const empresaUpperCase = empresa.toUpperCase();
  const razonSocialUpperCase = razon_social.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM empresas WHERE upper(empresa)=$1`, [empresaUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra registrado la empresa",
          });
        } else {
          return client
            .query(`INSERT INTO empresas( id_pais, empresa, razon_social, no_contrato)
              VALUES($1,$2,$3,$4)`, [
              id_pais, empresaUpperCase, razonSocialUpperCase, no_contrato
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
const postCategory = async (req, res = response) => {
  const { categoria, id_estatus } = req.body;
  const categoriaUpperCase = categoria.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM categoria_suscripcion WHERE upper(categoria)=$1`, [categoriaUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra registrada la categoria",
          });
        } else {
          return client
            .query(`INSERT INTO categoria_suscripcion( categoria, id_estatus)
              VALUES($1,$2)`, [
              categoriaUpperCase, id_estatus
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
const postMark = async (req, res = response) => {
  const { id_empresa, marca } = req.body;
  const marcaUpperCase = marca.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM marcas WHERE upper(marca)=$1 AND id_empresa=$2`, [marcaUpperCase, id_empresa])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra registrada la marca",
          });
        } else {
          return client
            .query(`INSERT INTO marcas( id_empresa, marca)
              VALUES($1,$2)`, [
              id_empresa, marcaUpperCase
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
const postSubscription = async (req, res = response) => {
  const { id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcion, descripcion, id_estatus } = req.body;
  const suscripcionUpperCase = suscripcion.toUpperCase();
  const descripcionUpperCase = descripcion.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM suscripciones WHERE id_pais=$1 AND id_empresa=$2 AND id_marca=$3 AND id_categoria_suscripcion=$4 AND UPPER(suscripcion)=$5`,
        [id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcionUpperCase])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya se encuentra registrada suscripción",
          });
        } else {
          return client
            .query(`INSERT INTO public.suscripciones(
              id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcion, descripcion, id_estatus)
              VALUES ( $1, $2, $3, $4, $5, $6, $7);`, [
              id_pais, id_empresa, id_marca, id_categoria_suscripcion, suscripcionUpperCase, descripcionUpperCase, id_estatus
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
const postSubscriptor = async (req, res = response) => {
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
const postTypepay = async (req, res = response) => {
  const { tipo_pago, id_estatus } = req.body;
  const tipopagoUpper = tipo_pago.toUpperCase();
  pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM tipo_pago WHERE UPPER(tipo_pago)=$1`,
        [tipopagoUpper])
      .then((response) => {
        if (response.rows.length > 0) {
          res.status(200).json({
            ok: true,
            msg: "Ya existe el tipo de pago",
          });
        } else {
          return client
            .query(`INSERT INTO tipo_pago (
              tipo_pago, id_estatus)
              VALUES ($1, $2);`, [
              tipopagoUpper, id_estatus
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
  getCompanies,
  getBills,
  getCategories,
  getMarks,
  getSubscriptions,
  getSubscribers,
  getTypespay,
  getPaymentsmeans,
  getSubscriptiondetail,
  postStates,
  postContry,
  postStatus,
  postProfiles,
  postUsers,
  postCompany,
  postCategory,
  postMark,
  postSubscription,
  postSubscriptor,
  postTypepay,
  updateState,
  updateCountry,
  updateStatus,
  updateProfiles,
  updateUser,
  updateCompany,
  updateCategory,
  updateMark,
  updateSubscription,
  updateSubscriptor,
  updateTypepay,
  activateCountry,
  activateState,
};
