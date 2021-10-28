/*
Rutas para Notificaciones
host + /api/notifications
 */
const router = require("express").Router();
const { sendNotification,insertToken } = require("../controllers/notifications");

router.post("/sendNotification", sendNotification);
router.post("/insertToken", insertToken);


module.exports = router;
