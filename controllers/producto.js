const { request, response, json } = require('express');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { ObjectId } = require('mongoose').Types;
const getProductos = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            //.populate('usuario', 'nombre')
            .populate('usuario', 'nombre correo')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        msg: 'Lista de productos activos',
        listaProductos
    });

}


const getProductoPorId = async (req = request, res = response) => {
    const { id } = req.params;
    const prouductoById = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.status(201).json(prouductoById);
}

const getProductosAgotados = async (req = request, res = response) => {
    const prouductoById = await Producto.find({ stock: 0 })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.status(201).json(prouductoById);
}

const getProductosMasVendidos = async (req, res) => {
    //Se buscaran los productos de orden descendente por el mayor, ademas de colocar un limite de 5
    Producto.find().sort({ vendido: -1 }).limit(3).exec((err, productos) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(201).json(productos);
        }
    });
}

const getProductoPorCategoria = async (req, res) => {
    const {termino} = req.params;
    const esMongoID = ObjectId.isValid(termino);  //TRUE

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        const productos = await Producto.find({categoria: categoria.id});
        return res.json({
            //results: [ usuario ]
            productos
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    }

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    console.log(categorias)

    const productos = await Producto.find({categoria: categorias});
    res.json({
        productos
    })
}


const postProducto = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre });
    //validacion si el producto ya existe
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe en la DB`
        });
    }
    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = await Producto(data);
    //Guardar en DB
    await producto.save();
    res.status(201).json(producto);
}


const putProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...restoData } = req.body;

    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }
    const productoDB = await Producto.findOne({ nombre: restoData.nombre });
    //validacion si el producto ya existe
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe en la DB`
        });
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, { new: true });
    res.status(201).json({
        msg: 'Put Controller Producto',
        productoActualizado
    })
}

const deleteProducto = async (req = request, res = response) => {
    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const productoEliminado = await Producto.findByIdAndDelete( id );
    //Eliminar por el estado:false
    // const productoEliminado_ = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json({
        msg: 'DELETE',
        productoEliminado
    })

}


module.exports = {
    postProducto,
    putProducto,
    deleteProducto,
    getProductos,
    getProductoPorId,
    getProductosAgotados,
    getProductosMasVendidos,
    getProductoPorCategoria,
}
