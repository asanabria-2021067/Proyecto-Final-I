const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Factura = require('../models/factura');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const getMiFactura = async (req = request, res = response) => {
    const _id = req.usuario.id;
    const query = { usuario: _id };
    const listaFactura = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query).populate('usuario', 'nombre')
        .populate({
            path: 'usuario',
            populate: { 
              path: 'carrito', 
              select: 'nombre precio'
            }
        })
    ]);
    
    res.status(201).json(listaFactura);
}

const getFacturas = async (req = request, res = response) => {
    const listaFactura = await Promise.all([
        Factura.countDocuments(),
        Factura.find().populate('usuario', 'nombre')
        .populate({
            path: 'usuario',
            populate: { 
              path: 'carrito', 
              select: 'nombre precio'
            }
        })
    ]);
    res.status(201).json(listaFactura);
}

const postFactura = async (req = request, res = response) => {
    const _id = req.usuario.id;
    const { usuario, fecha, ...body } = req.body;
    const today = new Date();
    const date = today.toLocaleDateString();
    const buscarUsuario = await Usuario.findById(_id);
    console.log(buscarUsuario);
    let todoBien = true;
    for (i = 0; i < buscarUsuario.carrito.length; i++) {
        const compruebaStock = await Producto.findById(buscarUsuario.carrito[i])
        console.log("COMPRUEBA STOCK", compruebaStock)
        if (compruebaStock.stock != 0) {
            const stockActualizado = await Producto.findByIdAndUpdate(buscarUsuario.carrito[i], { stock: compruebaStock.stock - buscarUsuario.cantidad[i] });
            const vendidoActualizado = await Producto.findByIdAndUpdate(buscarUsuario.carrito[i], { vendido: compruebaStock.vendido + buscarUsuario.cantidad[i] });
            todoBien=true;
        } else if(compruebaStock.stock == 0) {
            todoBien = false;
            return res.status(400).json({
                msg: `El producto ${compruebaStock.nombre}, no tiene stock`
                
            })
            
        }
    }
    if(todoBien){
        const data = {
            ...body,
            usuario: req.usuario._id,
            fecha: date
        }
        const factura = await Factura(data);
        await factura.save();
        res.status(201).json(factura)
    }
    
}


module.exports = {
    getFacturas,
    postFactura,
    getMiFactura
}


// CONTROLADOR