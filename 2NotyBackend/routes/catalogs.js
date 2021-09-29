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
  updateCountry,
  updateState,
  activateCountry,
  activateState,
} = require("../controllers/catalogs");
router.get("/getStatus", getStatus);
router.get("/getCountries", getCountries);
router.get("/getStates/:id", getStates);
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
router.put("/updateCountry", updateCountry);
router.put("/updateState", updateState);
/* router.put("/activateCountry/:id", activateCountry);
router.put("/activateState/:id", activateState); */

module.exports = router;
