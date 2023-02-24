const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

//Manejo de rutas
router.get('/:coleccion/:termino' ,buscar);


module.exports = router;