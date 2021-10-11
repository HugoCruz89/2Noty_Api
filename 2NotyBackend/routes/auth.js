/*
Rutas de usuarios Auth
host + /api/auth
 */

const router = require('express').Router();

const{validarCampos}=require('../middlewares/validar-campos')
const {
  getUsers,
  register,
  login,
  revalidarToken,
  userValidate,
  EmailResetPassword,
  emailResetPassword,
  revalidateUser,
  resetPassword
} = require("../controllers/auth");
const { check } = require("express-validator");
const { route } = require('./catalogs');

router.post(
  "/register",
  [
    check("name", "El nombre es oligatorio").not().isEmpty(),
    check("email", "El email es oligatorio").isEmail(),
    check("password", "El passwrod es de 6 caracteres").isLength(6),
    check("idPais", "El pais es oligatorio").not().isEmpty(),
    check("idEstado", "El estado es oligatorio").not().isEmpty(),
    validarCampos
  ],
  register
);

router.post(
  "/",
  [
    check("email", "El email es oligatorio").isEmail(),
    check("password", "El passwrod es de 6 caracteres").isLength(6),
    validarCampos
  ],
  login
);

router.post("/userValidate/:jwt",userValidate);
router.post("/emailResetPassword",[
  check("email", "El email es oligatorio").isEmail(),validarCampos
],emailResetPassword);

router.post(
  "/resetPassword",
  [
    check("email", "El email es oligatorio").isEmail(),
    check("newPassword", "El passwrod es de 6 caracteres").isLength(6),
    validarCampos
  ],
  resetPassword
);
router.get("/renew", revalidarToken);

router.get("/getUsers", getUsers);

router.post("/revalidateUser",revalidateUser)



module.exports = router;
