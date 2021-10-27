/*
Rutas para Notificaciones
host + /api/user
 */
const router = require("express").Router();
const { check } = require("express-validator");
const { getUser,postUser } = require("../controllers/user");
router.get("/", getUser);
router.post(
    "/insertUser",
    [check("correo", "El correo es obligatorio").not().isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty()],
    postUser
  );
module.exports = router;

