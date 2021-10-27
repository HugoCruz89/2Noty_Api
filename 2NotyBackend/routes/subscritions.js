/*
Rutas para Suscripciones
host + /api/subscriptions
 */
const router = require("express").Router();
const multer = require("multer");

const URI_IMAGE = `/var/www/html/assets/img/subscription`;
const diskStorage = multer.diskStorage({
  destination: URI_IMAGE,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const fileUpload = multer({
  storage: diskStorage,
}).single("image");

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
router.post("/saveImage", fileUpload, (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "saved",
    name: req.file.filename,
  });
});
module.exports = router;
