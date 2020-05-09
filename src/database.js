//conexion data base Mongo
const mongoose = require('mongoose');

//Dependencia dotenv para que lea el .env
require('dotenv').config();

//Configuracion de mongoose necesaria 
mongoose.set('useFindAndModify', false);

//Conexion al servidor de mongo atlas
mongoose.connect(process.env.MONGODB_NOMBRE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Base de datos conectada a mongo Atlas'))
    .catch(err => console.error(err));

