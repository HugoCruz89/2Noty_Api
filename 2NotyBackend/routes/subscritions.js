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
  postCategorySubscription,
  getCategoriesSubscription,
  getSubscriptionsByIdCategory
} = require("../controllers/subscriptions");

router.get("/", getSubscriptions);
router.get("/detail", getSubscriptionDetail);
router.post("/insertSubscription", postSubscription);
router.put("/updateSubscription", updateSubscription);
router.post("/insertCategorySubscription", postCategorySubscription);
router.get("/getCategorySubscription", getCategoriesSubscription);
router.get("/getSubscriptionByIdCategory/:id", getSubscriptionsByIdCategory);


module.exports = router;
