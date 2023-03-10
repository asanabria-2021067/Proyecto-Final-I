const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
    },
    rol: {
        type: String,
        required: true,
        //enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    carrito: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
    }],
    cantidad: [{
        type: Number,
        default: 0
    }],
    total: {
        type: Number,
        default: 0
    },
    
});


module.exports = model('Usuario', UsuarioSchema);