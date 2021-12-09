/*
Rutas de usuarios Auth
host + /api/catalogs
 */
const { check } = require("express-validator");
const router = require("express").Router();

const { getMenu, postMenu, updateMenu, getSubMenu, postSubMenu, updateSubMenu, getRelationMenuSubmenu, getRelationMenuSubmenuProfile } = require("../controllers/menu");
router.get("/:id", getMenu);

router.post("/insertMenu", postMenu);

router.put("/updateMenu", updateMenu);

router.get("/getSubMenu/:id", getSubMenu);

router.post("/insertSubMenu", postSubMenu);

router.put("/updateSubMenu", updateSubMenu);

router.get("/getRelationMenuSubmenuProfile/:id", getRelationMenuSubmenuProfile);

module.exports = router;
