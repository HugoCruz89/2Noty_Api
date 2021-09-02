/*
Rutas de usuarios Auth
host + /api/catalogs
 */
const router = require('express').Router();
const {getStatus,getCountries,getStates} =require('../controllers/catalogs');
router.get('/getStatus',getStatus);
router.get('/getCountries',getCountries);
router.get('/getStates',getStates);

module.exports= router;