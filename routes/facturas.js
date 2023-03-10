const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getFacturas, postFactura, getMiFactura } = require('../controllers/factura');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    validarCampos
], getFacturas );

router.get('/miFactura/',[
    validarJWT,
    validarCampos
], getMiFactura );
// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    validarCampos
] ,postFactura);

module.exports = router;