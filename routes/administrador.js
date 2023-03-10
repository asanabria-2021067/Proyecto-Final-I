//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAdministrador, postAdministrador, deleteClientes, deleteAdministrador, putClientes, putAdministrador } = require('../controllers/administrador');
const { emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrarAdministradores', getAdministrador);

router.post('/agregarAdministrador', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postAdministrador);

router.put('/editarAdministrador/', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    validarCampos
] ,putAdministrador);

router.put('/editorClientes/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    validarCampos
] ,putClientes);

router.delete('/eliminarAdministrador/', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    validarCampos
] ,deleteAdministrador);

router.delete('/eliminadorClientes/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    validarCampos
] ,deleteClientes);

module.exports = router;


// ROUTES