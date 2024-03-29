const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true, rol: "CLIENTE_ROLE"};

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.status(201).json(listaUsuarios);

}

const postUsuario = async (req = request, res = response) => {

    //Desestructuración
    rol = "CLIENTE_ROLE"
    const { nombre, correo, password } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.status(201).json(usuarioGuardadoDB);


}


const putUsuario = async (req = request, res = response) => {
    const id = req.usuario.id;

    const { _id,correo, ...resto } = req.body;
    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.status(201).json(usuarioEditado);


}

const deleteUsuario = async(req = request, res = response) => {
    const id = req.usuario.id;

    //Eliminar fisicamente de la DB
    const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    res.status(201).json(usuarioEliminado);

}


module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
}


// CONTROLADOR