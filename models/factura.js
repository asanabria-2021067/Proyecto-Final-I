const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precioTotal: {
        type: Number,
        defaultValue: 0
        // value: producto.total
    },
    producto:[{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }],

});


module.exports = model('Factura', FacturaSchema);