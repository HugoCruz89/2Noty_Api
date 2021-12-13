/*
Rutas de usuarios Auth
host + /api/agend
 */

const router = require('express').Router();
const{validarCampos}=require('../middlewares/validar-campos')
const { check } = require("express-validator");
const {
    register,getReminders
  } = require("../controllers/agend");
router.post(
    "/register",
    [
      check("id_usuario", "El nombre es oligatorio").not().isEmpty(),
      check("fecha", "El campo fecha es oligatorio").not().isEmpty(),
      check("hora", "El campo hora es oligatorio").not().isEmpty(),
      check("asunto", "El campo asunto es obligatrio").not().isEmpty(),
      check("titulo", "El campo titulo es obligatorio").not().isEmpty(),
      check("id_recordatorio", "El id del recordatorio es oligatorio").not().isEmpty(),
      validarCampos
    ],
    register
  );
  
router.get("/getReminders", getReminders);


module.exports = router;