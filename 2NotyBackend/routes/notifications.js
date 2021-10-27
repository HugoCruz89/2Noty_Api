/*
Rutas para Notificaciones
host + /api/notifications
 */
const router = require("express").Router();
const { sendNotification } = require("../controllers/notifications");

router.post("/sendNotification", sendNotification);

module.exports = router;
