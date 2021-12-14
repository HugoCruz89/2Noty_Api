// this file, help you to call some querys
const { pool } = require("./../dbCongif");
const { getDateNow } = require("./../helpers/helpers");
const existSubscrition = async (
  id_pais,
  id_empresa,
  id_marca,
  id_categoria_suscripcion,
  suscripcionUpperCase
) => {
  const databaseResponse = await pool.connect().then((client) => {
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
        client.release();
        if (response.rows.length > 0) {
          const obj = {
            ok: true,
            msg: "Ya se encuentra en BD la suscripción",
            id_suscripcion: response.rows[0].id_suscripcion,
          };
          return obj;
        } else {
          const obj = {
            ok: false,
            msg: "No se encontro ningua suscripcion",
          };
          return obj;
        }
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const insertSubscription = async (data, pathImage, pathIcono) => {
  const {
    id_pais,
    id_empresa,
    id_marca,
    id_categoria_suscripcion,
    suscripcion,
    descripcion,
    id_estatus,
  } = data;
  const suscripcionUpperCase = suscripcion.toUpperCase();
  const descripcionUpperCase = descripcion.toUpperCase();
  const databaseResponse = await pool.connect().then((client) => {
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
          pathImage,
          pathIcono,
        ]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          msg: response.command,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};
const updateSubscription = async (data, pathImage, pathIcono) => {
  const {
    id_suscripcion,
    id_pais,
    id_empresa,
    id_marca,
    id_categoria_suscripcion,
    suscripcion,
    descripcion,
    id_estatus,
  } = data;
  const suscripcionUpperCase = suscripcion.toUpperCase();
  const descripcionUpperCase = descripcion.toUpperCase();
  const queryImagen = pathImage ? `,url_imagen='${pathImage}'` : '';
  const queryIcono = pathIcono ? `,url_icono='${pathIcono}'` : '';
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `UPDATE public.suscripciones
        SET  id_pais=$2, id_empresa=$3, id_marca=$4, id_categoria_suscripcion=$5, suscripcion=$6, descripcion=$7, id_estatus=$8  ${queryImagen} ${queryIcono}
        WHERE id_suscripcion=$1;`,
        [
          id_suscripcion,
          id_pais,
          id_empresa,
          id_marca,
          id_categoria_suscripcion,
          suscripcionUpperCase,
          descripcionUpperCase,
          id_estatus,
        ]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          msg: response.command,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const insertSuscriptor = async (data, idusuario) => {
  const id_suscripcion = parseInt(data.id_suscripcion);
  const id_usuario = parseInt(idusuario);
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO public.suscriptores(
      id_usuario, id_suscripcion, fecha_suscripcion, id_estatus)
      VALUES ($1, $2, $3, $4) RETURNING id_suscriptor;`,
        [id_usuario, id_suscripcion, getDateNow(), 1]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          idSuscriptor: response.rows[0].id_suscriptor,
          codigo: 201,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
          codigo: 200,
        };
      });
  });
  return databaseResponse;
};

const insertSuscriptorPropertyes = async (id_suscriptor, descripcion, valor) => {

  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO public.detalle_suscripcion(
      id_suscriptor, descripcion, valor)
      VALUES ($1, $2, $3) RETURNING id_suscriptor;`,
        [id_suscriptor, descripcion, valor]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          idSuscriptor: response.command,
          codigo: 201,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
          codigo: 200,
        };
      });
  });
  return databaseResponse;
};

const existSubscritor = async (data, idusuario) => {
  const id_suscripcion = parseInt(data.id_suscripcion);
  const id_usuario = parseInt(idusuario);
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `select * from suscriptores WHERE id_usuario=$1 AND id_suscripcion=$2`,
        [id_usuario, id_suscripcion]
      )
      .then((response) => {
        client.release();
        if (response.rows.length > 0) {
          const obj = {
            ok: true,
            msg: "Ya cuentas con esta suscripcion",
            id_suscripcion: response.rows[0].id_suscripcion,
            codigo: 200,
          };
          return obj;
        } else {
          const obj = {
            ok: false,
            msg: "No se encontro ningun suscriptor",
            codigo: 200,
          };
          return obj;
        }
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const insertPropiedadesSuscripcion = async (data, idSubscription) => {
  const { label, hidden, required, editable, type, name, order } = data;
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO public.propiedades_suscripcion(
            label, type, regex, hidden, id_suscripcion,required,editable,name,"order")
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [label, type, "", hidden, idSubscription, required, editable, name, order]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          msg: response.command,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};
const updatePropiedadesSuscripcion = async (data, idSubscription) => {
  const { id, label, hidden, required, editable, type, name, order } = data;
  const databaseResponse = await pool.connect().then((client) => {

    if (id <= 0)
      return client.query(
        `INSERT INTO public.propiedades_suscripcion(
          label, type, regex, hidden, id_suscripcion,required,editable,name,"order")
          VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [label, type, "", hidden, idSubscription, required, editable, name, order]
      )
        .then((response) => {
          client.release();
          return {
            ok: true,
            msg: response.command,
          };
        })
        .catch((err) => {
          client.release();
          return {
            ok: false,
            msg: err,
          };
        });
    else
      return client.query(
        `UPDATE propiedades_suscripcion SET
            label=$2, type=$3, hidden=$4, required=$5,editable=$6,name=$7,"order"=$8
            WHERE id_propiedad=$1`,
        [id, label, type, hidden, required, editable, name, order]
      )
        .then((response) => {
          client.release();
          return {
            ok: true,
            msg: response.command,
          };
        })
        .catch((err) => {
          client.release();
          return {
            ok: false,
            msg: err,
          };
        });
  });
  return databaseResponse;
};

const insertTokenToPushNotification = async (idTItular, platform, token) => {
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO public.token_notificaciones(
            id_usuario, token, plataforma)
            VALUES ( $1, $2, $3);`,
        [idTItular, token, platform]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          msg: response.command,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const updateTokenToPushNotification = async (idTItular, platform, token) => {
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `UPDATE public.token_notificaciones SET token=$3, plataforma=$2 WHERE id_usuario=$1`,
        [idTItular, platform, token]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          msg: response.command,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const existTokenNotification = async (idTItular) => {
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(`SELECT * FROM token_notificaciones WHERE id_usuario=$1`, [
        idTItular,
      ])
      .then((response) => {
        client.release();
        if (response.rows.length > 0) {
          const obj = {
            ok: true,
            msg: "Ya se encuentra en BD la token",
            id_suscripcion: response.rows[0].id_usuario,
          };
          return obj;
        } else {
          const obj = {
            ok: false,
            msg: "No se encontro ningua suscripcion",
          };
          return obj;
        }
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const getAllSubscription = async () => {
  const dataBaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `SELECT sc.id_suscripcion,sc.id_pais,p.pais,sc.id_empresa,em.empresa,sc.id_marca,m.marca,sc.id_categoria_suscripcion,cs.categoria,sc.suscripcion,sc.descripcion,sc.id_estatus,es.estatus,sc.url_imagen,sc.url_icono,
        (select array_to_json(array_agg(d.*)) from (select ps.id_propiedad,ps.label,LOWER(td.tipo_dato) as type,ps.hidden,ps.required,ps.editable,ps.name,ps.order from propiedades_suscripcion ps, cat_tipo_dato td where sc.id_suscripcion = ps.id_suscripcion AND td.id_tipo_dato=ps.type)d) as propertys
        FROM suscripciones sc, paises p, empresas em, marcas m, categoria_suscripcion cs,estatus es
        WHERE sc.id_pais=p.id_pais AND sc.id_empresa=em.id_empresa AND sc.id_marca=m.id_marca AND sc.id_categoria_suscripcion=cs.id_categoria_suscripcion AND sc.id_estatus=es.id_estatus;`
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          data: response.rows,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return dataBaseResponse;
};

const getAllSubscriptionByIdCategory = async (id) => {
  const dataBaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `SELECT sc.id_suscripcion,sc.id_pais,p.pais,sc.id_empresa,em.empresa,sc.id_marca,m.marca,sc.id_categoria_suscripcion,cs.categoria,sc.suscripcion,sc.descripcion,sc.id_estatus,es.estatus,sc.url_imagen,sc.url_icono,
        (SELECT array_to_json(array_agg(d.*)) FROM (SELECT ps.id_propiedad, ps.label,ps.hidden,ps.required,ps.editable,ps.name,(SELECT tipo_dato FROM cat_tipo_dato tp where tp.id_tipo_dato=ps.type) AS type,ps.order FROM propiedades_suscripcion ps WHERE sc.id_suscripcion = ps.id_suscripcion)as d) as propertys
            FROM suscripciones sc, paises p, empresas em, marcas m, categoria_suscripcion cs,estatus es
            WHERE sc.id_categoria_suscripcion=$1 AND sc.id_pais=p.id_pais AND sc.id_empresa=em.id_empresa AND sc.id_marca=m.id_marca AND sc.id_categoria_suscripcion=cs.id_categoria_suscripcion AND sc.id_estatus=es.id_estatus;`,
        [id]
      )
      .then((response) => {
        client.release();
        // let data = [];
        // if (response.rows.length > 0) {
        //   // groupList(response.rows)
        //   data = response.rows.reduce((acc, item) => {
        //     if (!acc.find((x) => x.id_suscripcion === item.id_suscripcion)) {
        //       acc.push(item);
        //     }
        //     return acc;
        //   }, []);

        //   data.forEach((Element) => {
        //     const auxArray = response.rows.filter(
        //       (x) => x.id_suscripcion === Element.id_suscripcion
        //     );
        //     let arr = [];
        //     auxArray.map((item) => {
        //       arr.push({
        //         label: item.label,
        //         type: item.type.toLowerCase(),
        //         hidden: item.hidden,
        //         required: item.required,
        //         editable: item.editable,
        //         name: item.name,
        //       });
        //       Element.propertys = arr;
        //     });
        //     delete Element.id_propiedad;
        //     delete Element.label;
        //     delete Element.type;
        //     delete Element.regex;
        //     delete Element.hidden;
        //     delete Element.required;
        //     delete Element.editable;
        //     delete Element.name;
        //   });
        // }

        return {
          ok: true,
          data:response.rows,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: "error: " + err,
        };
      });
  });
  return dataBaseResponse;
};

const getAllSubscriptionByIdCategoryandCountry = async (id,id_pais) => {
  const dataBaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `SELECT sc.id_suscripcion,sc.id_pais,p.pais,sc.id_empresa,em.empresa,sc.id_marca,m.marca,sc.id_categoria_suscripcion,cs.categoria,sc.suscripcion,sc.descripcion,sc.id_estatus,es.estatus,sc.url_imagen,sc.url_icono,
        (SELECT array_to_json(array_agg(d.*)) FROM (SELECT ps.id_propiedad, ps.label,ps.hidden,ps.required,ps.editable,ps.name,(SELECT tipo_dato FROM cat_tipo_dato tp where tp.id_tipo_dato=ps.type) AS type,ps.order FROM propiedades_suscripcion ps WHERE sc.id_suscripcion = ps.id_suscripcion)as d) as propertys
            FROM suscripciones sc, paises p, empresas em, marcas m, categoria_suscripcion cs,estatus es
            WHERE sc.id_categoria_suscripcion=$1 AND sc.id_pais=$2 AND sc.id_pais=p.id_pais AND sc.id_empresa=em.id_empresa AND sc.id_marca=m.id_marca AND sc.id_categoria_suscripcion=cs.id_categoria_suscripcion AND sc.id_estatus=es.id_estatus;`,
        [id,id_pais]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          data:response.rows,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: "error: " + err,
        };
      });
  });
  return dataBaseResponse;
};

const getAllSubscriptionByIdUser = async (id) => {
  const dataBaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `SELECT sc.id_suscripcion,sc.id_pais,p.pais,sc.id_empresa,em.empresa,sc.id_marca,m.marca,sc.id_categoria_suscripcion,cs.categoria,sc.suscripcion,sc.descripcion,sc.id_estatus,es.estatus,sc.url_imagen,sc.url_icono,
        (SELECT array_to_json(array_agg(d.*)) FROM (SELECT ps.id_propiedad, ps.label,ps.hidden,ps.required,ps.editable,ps.name,(SELECT tipo_dato FROM cat_tipo_dato tp where tp.id_tipo_dato=ps.type) AS type,ps.order FROM propiedades_suscripcion ps WHERE sc.id_suscripcion = ps.id_suscripcion)as d) as propertys
            FROM suscripciones sc, suscriptores st, paises p, empresas em, marcas m, categoria_suscripcion cs,estatus es
            WHERE st.id_usuario=$1 AND sc.id_pais=p.id_pais AND sc.id_empresa=em.id_empresa AND sc.id_marca=m.id_marca AND sc.id_categoria_suscripcion=cs.id_categoria_suscripcion AND sc.id_estatus=es.id_estatus AND sc.id_suscripcion=st.id_suscripcion;`,
        [id]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          data:response.rows,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: "error: " + err,
        };
      });
  });
  return dataBaseResponse;
};

const getAllTokensSubscribers = async (id) => {
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `SELECT array_to_json(array_agg(tn.token)) as jsontokens ,array_to_json(array_agg(sc.id_usuario)) as jsonusers
        FROM suscripciones s, suscriptores sc, token_notificaciones tn
        WHERE s.id_suscripcion=sc.id_suscripcion AND sc.id_usuario=tn.id_usuario AND sc.id_suscripcion=s.id_suscripcion AND s.id_suscripcion=${id};`
      )
      .then((response) => {
        client.release();
        return {
          data: response.rows
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const insertUserPublication = async (id_usuario, id_publicacion) => {
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO public.publicacion_usuario(
          id_usuario, id_publicacion, id_estatus)
          VALUES ( $1, $2, 1);`,
        [id_usuario, id_publicacion]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          msg: response.command,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

const updateStatusPublication = async (idPublication) => {
  
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `UPDATE publicaciones
        SET id_estatus=5
        WHERE id_publicacion=$1;`,
        [
          idPublication
        ]
      )
      .then((response) => {
        client.release();
        return {
          ok: true,
          msg: response.command,
        };
      })
      .catch((err) => {
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });
  return databaseResponse;
};

module.exports = {
  existSubscrition,
  insertSubscription,
  insertPropiedadesSuscripcion,
  insertTokenToPushNotification,
  existTokenNotification,
  updateTokenToPushNotification,
  getAllSubscription,
  insertSuscriptor,
  updateSubscription,
  existSubscritor,
  insertSuscriptorPropertyes,
  updatePropiedadesSuscripcion,
  getAllSubscriptionByIdCategory,
  getAllTokensSubscribers,
  insertUserPublication,
  updateStatusPublication,
  getAllSubscriptionByIdCategoryandCountry,
  getAllSubscriptionByIdUser
};
