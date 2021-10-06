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
  postUsers
} = require("../controllers/catalogs");
router.get("/getStatus", getStatus);
router.get("/getCountries", getCountries);
router.get("/getStates/:id", getStates);
router.get("/getUsers", getUsuarios);
router.get("/getProfiles/:id", getProfiles);
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
router.put("/updateCountry", updateCountry);
router.put("/updateState", updateState);
router.put("/updateStatus", updateStatus);
router.put("/updateProfile", updateProfiles);
/* router.put("/activateCountry/:id", activateCountry);
router.put("/activateState/:id", activateState); */

module.exports = router;
