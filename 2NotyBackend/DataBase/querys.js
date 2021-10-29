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

const insertPropiedadesSuscripcion=async(data, idSubscription)=>{

const {label,hidden,required,editable,type,name}=data
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

module.exports = { existSubscrition, insertSubscription,insertPropiedadesSuscripcion };
