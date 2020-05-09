const {Schema, model} = require('mongoose');

//modelo de documento para la coleccion media de fabio
const mediaSchema = new Schema({
    fecha: {type: String, default: ((new Date()).getDate()+'/'+((new Date()).getMonth()+1)+'/'+(new Date()).getFullYear()) },
    numero: Number,
    alt: Number,
    enlace:{type: String, default:''},
    parrafo:{type: String, default:''},
    imgURL: String,
    public_id:String
});


module.exports = model('media',mediaSchema);