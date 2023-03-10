const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const getCarrito = async (req = request, res = response) => {
    const id = req.usuario.id;
    let usuario = await Usuario.findById( id )
    .populate('carrito', 'nombre, precio');
    res.status(201).json( usuario );

}

const postCarrito = async(req = request, res = response) => {
    const _id = req.usuario.id;
    let totales = 0;
    let totalFinal = 0;
    const { id , cantidadIngresada } = req.params;
    const carritoAgregar = await Usuario.findByIdAndUpdate(_id, {$push:{carrito: [id]}});
    const carritoAgregar2 = await Usuario.findByIdAndUpdate(_id, {$push:{cantidad: [cantidadIngresada]}});

    const usuario = await Usuario.findById(_id);

    for(i = 0; i<usuario.carrito.length; i++){
        // console.log(i)
        const productoEncontrado = await Producto.findById(usuario.carrito[i]);
        // console.log(productoEncontrado.precio);
        const precio = productoEncontrado.precio;
        console.log("PRECIO", precio)
        for(j = 0; j<usuario.cantidad.length; j++){
        const cantidad = parseInt(usuario.cantidad[j]);
        console.log("Cantidad", cantidad)
        totales = precio * cantidad;
        console.log("TOTALES", totales)
        
    }
    totalFinal = totales + totalFinal;
    }
    console.log("Total",totalFinal)
    const totalGuardado = await Usuario.findByIdAndUpdate(_id, {total: totalFinal})
    res.status(201).json(totalGuardado);

}

const putCarrito = async (req = request, res = response) => {
    const id = req.usuario.id;
    const { ...resto } = req.body;

    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.status(201).json(usuarioEditado);

}
const deleteCarrito = async(req = request, res = response) => {
    const id = req.usuario.id;
    carrito = []
    cantidad = []
    total = 0
    //Eliminar fisicamente de la DB
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, {carrito: carrito});
    const usuarioEliminado_ = await Usuario.findByIdAndUpdate(id, {cantidad: cantidad}, );
    const usuarioEliminado1 = await Usuario.findByIdAndUpdate(id, {total: total});
    res.status(201).json(usuarioEliminado1);
}

// const deleteProductoCarrito = async(req = request, res = response) => {
//     const id = req.usuario.id;
//     const {_id} = req.params;
//     //Eliminar fisicamente de la DB
//     const buscador = await Producto.findById(_id);
//     if(buscador){
//         const usuarioEliminado = await Usuario.findByIdAndUpdate(id, {$pull:{carrito: _id}});
//         res.status(201).json(usuarioEliminado);
//     }else{
//         res.status(404).json(`El producto ${buscador.id} no existe en la DB`)
//     }
    
// }

module.exports = {
    getCarrito,
    postCarrito,
    putCarrito,
    deleteCarrito,
}


// CONTROLADOR