/*
Rutas de usuarios Auth
host + /api/agend
 */

const router = require('express').Router();
const{validarCampos}=require('../middlewares/validar-campos')
const { check } = require("express-validator");
const {
    register,
  } = require("../controllers/agend");
router.post(
    "/register",
    [
      check("id_usuario", "El nombre es oligatorio").not().isEmpty(),
      check("fecha", "El email es oligatorio").not().isEmpty(),
      check("asunto", "El passwrod es de 6 caracteres").not().isEmpty(),
      check("titulo", "El pais es oligatorio").not().isEmpty(),
      validarCampos
    ],
    register
  );


module.exports = router;