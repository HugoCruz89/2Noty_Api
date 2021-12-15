/*
Rutas para Notificaciones
host + /api/user
 */
const router = require("express").Router();
const { check } = require("express-validator");
const {
  getUser,
  postUser,
  updateUser,
  updateProfileUser,
} = require("../controllers/user");
router.get("/:id", getUser);
router.post(
  "/insertUser",
  [
    check("correo", "El correo es obligatorio").not().isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
  ],
  postUser
);
router.put("/updateUser", updateUser);
router.put("/updateProfileUser", updateProfileUser);
module.exports = router;
