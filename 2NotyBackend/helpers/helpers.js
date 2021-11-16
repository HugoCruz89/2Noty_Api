const bcrypt = require("bcrypt");
require("dotenv").config();

const getDateNow = () => {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);
  const dateNow = year + "-" + month + "-" + date;
  return dateNow;
};

const getDateNowCurrent = () => {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // current miliseconds
  let miliseconds = date_ob.getMilliseconds();

  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);
  const dateNow = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}-${miliseconds}`;

  return dateNow;
};

const hashedPassword = async (password) => {
  let hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const buildPathToSaveDataBaseImage = (name) => {
  if (name)
    return `${process.env.PATH_SERVER_TO_SAVE_DATABASE_IMAGE
      }${getDateNowCurrent()}-${name}`;
  else
    return name
};

const buildPathToSaveServerImage = (name) => {
  return `${process.env.PATH_SERVER_TO_SAVE_IMAGE
    }${getDateNowCurrent()}-${name}`;
};


const groupList = (item) => {
  let group = item.reduce((r, a) => {
    r[a.id_suscripcion] = [...r[a.id_suscripcion] || [], a];
    return r;
  }, {});

  //  const ListaArreglada= group.map((item,key)=>{
  //    console.log(item)
  //    console.log('key',key)
  //  })
}


module.exports = {
  getDateNow,
  hashedPassword,
  getDateNowCurrent,
  buildPathToSaveDataBaseImage,
  buildPathToSaveServerImage,
  groupList
};
