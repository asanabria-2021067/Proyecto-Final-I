const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getCategorias, getCategoriaPorID, postCategoria, putCategoria, deleteCategoria } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/', getCategorias );

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], getCategoriaPorID );

// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,postCategoria);

// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,putCategoria);

//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,deleteCategoria);



module.exports = router;