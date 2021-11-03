/*
Rutas para Notificaciones
host + /api/payment
 */

const router = require("express").Router();
const { getPaymentTypes ,getPaymentMethod,updatePaymentType,postPaymentType,postPaymentMethod, getUsersPayments, getCustomersPayments} = require("../controllers/payment");

router.get("/getPaymentTypes", getPaymentTypes);
router.get("/getPaymentMethods", getPaymentMethod);
router.get("/getUsersPayments", getUsersPayments);
router.get("/getCustomersPayments", getCustomersPayments);
router.put("/updatePaymentType", updatePaymentType);
router.post("/insertPaymentType", postPaymentType);
///falta documentar este metodo en swagger
router.post("/insertPaymentMethod", postPaymentMethod);
module.exports = router;