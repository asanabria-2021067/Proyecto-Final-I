const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre del producto es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        default: "POR DEFECTO",
        required: true
    },
    descripcion: { 
        type: String 
    },
    vendido:{
        type: Number,
        default: 0
    },
    stock:{
        type: Number,
        required: [true , 'El stock es importante'],
    },
    disponible: {
        type: Boolean,
        default: true 
    },
});


module.exports = model('Producto', ProductoSchema);