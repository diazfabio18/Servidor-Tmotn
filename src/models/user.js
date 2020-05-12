const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

//modelo de documento para la coleccion users
const userSchema = new Schema({
    username: String,
    password: String,
    imageprofile: {type:String, default: ''},
    media_subidas: {type: Number, min: 0},
    ult_conexion: {type: Date, dafault: Date.now()},
    description: {type: String, default: ''}

});

//Funciones necesarias para la encriptacion y validacion de contraseña

userSchema.methods.encriptacion = async (password)=>{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
} 

userSchema.methods.validarcontrasenia = async function (password){
    return await bcrypt.compare(password, this.password);
}

module.exports = model('user',userSchema);