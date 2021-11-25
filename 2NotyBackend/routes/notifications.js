/*
Rutas para Notificaciones
host + /api/notifications
 */
const router = require("express").Router();
const { check } = require("express-validator");
const { validarCampos } = require('../middlewares/validar-campos')
const { sendNotification, insertToken, getTypeNotification, postTypeNotification, updateTypeNotification, getNotification, postNotification, updateNotification, sendNotificationsAllSubscribers } = require("../controllers/notifications");

router.get("/typeNotification", getTypeNotification);
router.post("/insertTypeNotification", postTypeNotification);
router.put("/updateTypeNotification", updateTypeNotification);

router.get("/:id", getNotification);
router.post("/insertNotification", postNotification);
router.put("/updateNotification", updateNotification);

router.post("/sendNotification", sendNotification);
router.post("/insertToken", insertToken);

router.post("/sendNotificationsAllSubscribers", sendNotificationsAllSubscribers);



module.exports = router;
