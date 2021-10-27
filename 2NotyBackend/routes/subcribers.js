/*
Rutas para Suscripciones
host + /api/subcribers
 */
const router = require("express").Router();
const {
    getSubscribers,
    updateSubscribers,
    postSubscribers
} = require("../controllers/subscribers");

router.get("/", getSubscribers);
router.put("/updateSubscribers", updateSubscribers);
router.post("/insertSubscribers", postSubscribers)
module.exports = router;