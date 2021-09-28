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
  postStates,
  postContry,
  postStatus,
  updateCountry,
  updateState,
  activateCountry,
  activateState,
} = require("../controllers/catalogs");
router.get("/getStatus", getStatus);
router.get("/getCountries", getCountries);
router.get("/getStates", getStates);
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
router.put("/updateCountry", updateCountry);
router.put("/updateState", updateState);
/* router.put("/activateCountry/:id", activateCountry);
router.put("/activateState/:id", activateState); */

module.exports = router;
