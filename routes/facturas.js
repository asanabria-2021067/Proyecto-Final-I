const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getFacturas, postFactura, putFactura, deleteFactura } = require('../controllers/factura');
const { existeCategoriaPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/', getFacturas );

// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,postFactura);

// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,putFactura);

//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,deleteFactura);



module.exports = router;