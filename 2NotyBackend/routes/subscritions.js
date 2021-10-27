/*
Rutas para Suscripciones
host + /api/subscriptions
 */
const router = require("express").Router();
const {
  getSubscriptions,
  getSubscriptionDetail,
  postSubscription,
  updateSubscription,
} = require("../controllers/subscriptions");

router.get("/", getSubscriptions);
router.get("/detail", getSubscriptionDetail);
router.post("/insertSubscription", postSubscription);
router.put("/updateSubscription", updateSubscription);

module.exports = router;
