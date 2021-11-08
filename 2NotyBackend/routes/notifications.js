/*
Rutas para Notificaciones
host + /api/notifications
 */
const router = require("express").Router();
const { sendNotification,insertToken, getTypeNotification, postTypeNotification, updateTypeNotification, getNotification, postNotification, updateNotification } = require("../controllers/notifications");

router.get("/typeNotification",getTypeNotification);
router.post("/insertTypeNotification", postTypeNotification);
router.put("/updateTypeNotification", updateTypeNotification);

router.get("/:id",getNotification);
router.post("/insertNotification",postNotification);
router.put("/updateNotification",updateNotification);

router.post("/sendNotification", sendNotification);
router.post("/insertToken", insertToken);




module.exports = router;
