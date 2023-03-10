const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { postCarrito, getCarrito, putCarrito, deleteCarrito, deleteProductoCarrito } = require('../controllers/carrito');
const { existeProductoPorId } = require('../helpers/db-validators');
// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Manejo de rutas
router.get('/carrito/', [
    validarJWT,
    validarCampos,
] ,getCarrito)

router.put('/carritoAgregar/:id/:cantidadIngresada', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
] ,postCarrito);

router.put('/carrito/editar', [
    validarJWT,
    check('carrito', 'El carrito debe tener datos').not().isEmpty(),
    validarCampos,
] ,putCarrito);

router.delete('/carrito/delete', [
    validarJWT,
    validarCampos,
] ,deleteCarrito)

// router.delete('/carrito/delete/:id', [
//     validarJWT,
//     validarCampos,
// ] ,deleteProductoCarrito)
module.exports = router;