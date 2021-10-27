/*
Rutas de usuarios Auth
host + /api/catalogs
 */
const { check } = require("express-validator");
const router = require("express").Router();
const multer = require('multer');

const URI_IMAGE=`/var/www/html/assets/img/subscription`
const URI_IMEGE_LOCAL=`C:/TFS/2noty_web/2noty/public/assets/img/subscription`

const diskStorage = multer.diskStorage({
  destination: URI_IMAGE,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const fileUpload = multer({
  storage: diskStorage
}).single('image')
const {
  getStatus,
  getCountries,
  getStates,
  getProfiles,
  postStates,
  postContry,
  postStatus,
  postProfiles,
  updateCountry,
  updateState,
  updateStatus,
  activateCountry,
  activateState,
  updateProfiles,
  getCompanies,
  updateCompany,
  postCompany,
  updateUser,
  getBills,
  getCategories,
  updateCategory,
  postCategory,
  getMarks,
  updateMark,
  postMark,
  getTypesPay,
  postTypePay,
  updateTypePay,
  getPaymentsMeans,
  postPaymentsMeans,
  getPaymentsUser
} = require("../controllers/catalogs");
router.get("/getStatus", getStatus);
router.get("/getCountries", getCountries);
router.get("/getStates/:id", getStates);
router.get("/getProfiles", getProfiles);
router.get("/getCompanies", getCompanies);
router.get("/getBills", getBills);
router.get("/getCategories", getCategories);
router.get("/getMarks", getMarks);
router.get("/getTypespay", getTypesPay);
router.get("/getPaymentsmeans", getPaymentsMeans);
router.get("/getPaymentsuser", getPaymentsUser);


router.post(
  "/state",
  [
    check("state", "El estado es obligatorio").not().isEmpty(),
    check("idCountry", "El pais es obligatorio").not().isEmpty(),
  ],
  postStates
);
router.post(
  "/country",
  [check("country", "El pais es obligatorio").not().isEmpty()],
  postContry
);
router.post(
  "/status",
  [check("status", "El estatus es obligatorio").not().isEmpty()],
  postStatus
)
router.post(
  "/profile",
  [check("perfil", "El perfil es obligatorio").not().isEmpty()],
  postProfiles
)

router.post(
  "/company",
  [check("empresa", "La empresa es obligatoria").not().isEmpty(),
  check("razon_social", "La razón social obligatoria").not().isEmpty(),
  check("no_contrato", "El numero de contrato es obligatorio").not().isEmpty(),
  check("id_pais", "El pais es obligatorio").not().isEmpty()],
  postCompany
)
router.post("/category", postCategory)
router.post("/mark", postMark)

router.post("/typepay", postTypePay)
router.post("/paymentsmeans", postPaymentsMeans)
router.post("/saveImage", fileUpload, (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "saved",
    name:req.file.filename
  });
})

router.put("/updateCountry", updateCountry);
router.put("/updateState", updateState);
router.put("/updateStatus", updateStatus);
router.put("/updateProfile", updateProfiles);
router.put("/updateUser", updateUser);
router.put("/updateCompany", updateCompany);
router.put("/updateCategory", updateCategory);
router.put("/updateMark", updateMark);


router.put("/updateTypepay", updateTypePay);
/* router.put("/activateCountry/:id", activateCountry);
router.put("/activateState/:id", activateState); */

module.exports = router;
