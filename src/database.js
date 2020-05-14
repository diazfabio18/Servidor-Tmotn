//conexion data base Mongo
const mongoose = require('mongoose');

//Dependencia dotenv para que lea las variables de entorno
require('dotenv').config();

//Configuracion de mongoose necesaria en FindByIdAndModify
mongoose.set('useFindAndModify', false);

//Conexion al servidor (Mongo Atlas)
mongoose.connect(process.env.MONGODB_NOMBRE, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Base de datos conectada a mongo Atlas'))
    .catch(err => console.error(err));
