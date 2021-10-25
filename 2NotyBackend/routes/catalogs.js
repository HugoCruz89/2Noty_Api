/*
Rutas de usuarios Auth
host + /api/catalogs
 */
const { check } = require("express-validator");
const router = require("express").Router();
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
  getUsuarios,
  postUsers,
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
  getSubscriptions,
  postSubscription,
  updateSubscription,
  getSubscribers,
  postSubscriptor,
  updateSubscriptor,
  getTypespay,
  postTypepay,
  updateTypepay,
  getPaymentsmeans,
  getSubscriptiondetail
} = require("../controllers/catalogs");
router.get("/getStatus", getStatus);
router.get("/getCountries", getCountries);
router.get("/getStates/:id", getStates);
router.get("/getUsers", getUsuarios);
router.get("/getProfiles", getProfiles);
router.get("/getCompanies", getCompanies);
router.get("/getBills", getBills);
router.get("/getCategories", getCategories);
router.get("/getMarks", getMarks);
router.get("/getSubscriptions", getSubscriptions);
router.get("/getSubscribers", getSubscribers);
router.get("/getTypespay", getTypespay);
router.get("/getPaymentsmeans", getPaymentsmeans);
router.get("/getSubscriptiondetail", getSubscriptiondetail);

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
  [check("status","El estatus es obligatorio").not().isEmpty()],
  postStatus
)
router.post(
  "/profile",
  [check("perfil","El perfil es obligatorio").not().isEmpty()],
  postProfiles
)
router.post(
  "/user",
  [check("correo","El correo es obligatorio").not().isEmpty(),
  check("nombre","El nombre es obligatorio").not().isEmpty()],
  postUsers
)
router.post(
  "/company",
  [check("empresa","La empresa es obligatoria").not().isEmpty(),
  check("razon_social","La razón social obligatoria").not().isEmpty(),
  check("no_contrato","El numero de contrato es obligatorio").not().isEmpty(),
  check("id_pais","El pais es obligatorio").not().isEmpty()],
  postCompany
)
router.post("/category",postCategory)
router.post("/mark",postMark)
router.post("/subscription",postSubscription)
router.post("/subscriptor",postSubscriptor)
router.post("/typepay",postTypepay)

router.put("/updateCountry", updateCountry);
router.put("/updateState", updateState);
router.put("/updateStatus", updateStatus);
router.put("/updateProfile", updateProfiles);
router.put("/updateUser", updateUser);
router.put("/updateCompany", updateCompany);
router.put("/updateCategory", updateCategory);
router.put("/updateMark", updateMark);
router.put("/updateSubscription", updateSubscription);
router.put("/updateSubscriptor", updateSubscriptor);
router.put("/updateTypepay", updateTypepay);
/* router.put("/activateCountry/:id", activateCountry);
router.put("/activateState/:id", activateState); */

module.exports = router;
