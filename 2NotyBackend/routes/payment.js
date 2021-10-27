/*
Rutas para Notificaciones
host + /api/payment
 */

const router = require("express").Router();
const { getPaymentTypes ,getPaymentMethod,updatePaymentType,postPaymentType,postPaymentMethod} = require("../controllers/payment");

router.get("/getPaymentTypes", getPaymentTypes);
router.get("/getPaymentMethods", getPaymentMethod);
router.put("/updatePaymentType", updatePaymentType);
router.post("/insertPaymentType", postPaymentType);
///falta documentar este metodo en swagger
router.post("/insertPaymentMethod", postPaymentMethod);
module.exports = router;