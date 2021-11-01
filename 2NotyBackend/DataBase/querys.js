// this file, help you to call some querys
const { pool } = require("./../dbCongif");
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

const insertPropiedadesSuscripcion = async (data, idSubscription) => {

  const { label, hidden, required, editable, type, name } = data
  const databaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `INSERT INTO public.propiedades_suscripcion(
            label, type, regex, hidden, id_suscripcion,required,editable,name)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          label,
          type,
          "",
          hidden,
          idSubscription,
          required,
          editable,
          name
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
}

const getAllSubscription = async () => {
  const dataBaseResponse = await pool.connect().then((client) => {
    return client
      .query(
        `SELECT sc.id_suscripcion,sc.id_pais,p.pais,sc.id_empresa,em.empresa,sc.id_marca,m.marca,sc.id_categoria_suscripcion,cs.categoria,sc.suscripcion,sc.descripcion,sc.id_estatus,es.estatus,sc.url_imagen,sc.url_icono,ps.*
        FROM suscripciones sc, paises p, empresas em, marcas m, categoria_suscripcion cs,estatus es, propiedades_suscripcion ps
        WHERE sc.id_pais=p.id_pais AND sc.id_empresa=em.id_empresa AND sc.id_marca=m.id_marca AND sc.id_categoria_suscripcion=cs.id_categoria_suscripcion AND sc.id_estatus=es.id_estatus AND sc.id_suscripcion = ps.id_suscripcion;`
      )
      .then((response) => {
        // client.release();
        let data = []
        if (response.rows.length > 0) {

          response.rows.forEach((val) => {
            if (data.length <= 0)
              data.push(val);
            else if (data[data.length - 1].id_suscripcion !== val.id_suscripcion) {
              data.push(val);
            }
          })
          data.forEach((Element) => {
            const auxArray = response.rows.filter(x => x.id_suscripcion === Element.id_suscripcion);
            let arr = []
            auxArray.map((item) => {
              arr.push({
                id_suscripcion: item.id_suscripcion,
                id_propiedad: item.id_propiedad,
                label: item.label,
                type: item.type,
                regex: item.regex,
                hidden: item.hidden,
                required: item.required,
                editable: item.editable,
                name: item.name
              })
              Element.propertys = arr
            })
            delete Element.id_propiedad
            delete Element.label
            delete Element.type
            delete Element.regex
            delete Element.hidden
            delete Element.required
            delete Element.editable
            delete Element.name
          })
        }

        return {
          ok: true,
          data
        };
      })
      .catch((err) => {
        console.log(err)
        client.release();
        return {
          ok: false,
          msg: err,
        };
      });
  });

  return dataBaseResponse;
}
module.exports = { existSubscrition, insertSubscription, insertPropiedadesSuscripcion, getAllSubscription };
