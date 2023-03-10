const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');

const getAdministrador = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true, rol: "ADMIN_ROLE" };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.status(201).json(listaUsuarios);

}

const postAdministrador = async (req = request, res = response) => {

    const { nombre, correo, password } = req.body;
    rol = "ADMIN_ROLE"
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.status(201).json(usuarioGuardadoDB);

}


const putAdministrador = async (req = request, res = response) => {
    const id = req.usuario.id;

    const { _id, correo, ...resto } = req.body;
   
    if ( resto.password ) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.status(201).json(usuarioEditado);

}

const putClientes = async (req = request, res = response) => {
    const { id } = req.params;

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

const deleteClientes = async(req = request, res = response) => {
    const { id } = req.params;

    //Eliminar fisicamente de la DB
    const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    res.status(201).json(usuarioEliminado);
}

const deleteAdministrador = async(req = request, res = response) => {
    const id = req.usuario.id;

    //Eliminar fisicamente de la DB
    const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    res.status(201).json(usuarioEliminado);
}

module.exports = {
    getAdministrador,
    postAdministrador,
    putAdministrador,
    deleteAdministrador,
    putClientes,
    deleteClientes
}


// CONTROLADOR