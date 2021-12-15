/*
Rutas para Suscripciones
host + /api/subscriptions
 */
const router = require("express").Router();

const {
  getSubscriptions,
  getSubscriptionDetail,
  postSubscription,
  putSubscription,
  postCategorySubscription,
  getCategoriesSubscription,
  getSubscriptionsByIdCategory,
  updateCategorySubscription,
  getSubscriptionsByIdCategoryandCountry,
  getSubscriptionsByIdUser
} = require("../controllers/subscriptions");

router.get("/", getSubscriptions);
router.get("/detail", getSubscriptionDetail);
router.post("/insertSubscription", postSubscription);
router.put("/updateSubscription", putSubscription);
router.post("/insertCategorySubscription", postCategorySubscription);
router.get("/getCategorySubscription", getCategoriesSubscription);
router.put("/updateCategorySubscription", updateCategorySubscription);
router.get("/getSubscriptionByIdCategory/:id", getSubscriptionsByIdCategory);
router.get("/getSubscriptionsByIdCategoryandCountry/:id/:idCountry", getSubscriptionsByIdCategoryandCountry);
router.get("/getSubscriptionByIdUser/:id", getSubscriptionsByIdUser);


module.exports = router;
