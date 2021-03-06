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
} = require("../controllers/auth");
const { check } = require("express-validator");

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

router.get("/renew", revalidarToken);

router.get("/getUsers", getUsers);



module.exports = router;
